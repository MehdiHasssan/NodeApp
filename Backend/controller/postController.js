const Joi = require('joi');
const Post = require('../models/post')
const {BACKEND_SERVER_PATH} = require('../config/index')
const PostDTO = require('../dto/postDto')
const PostDetailDTO = require('../dto/postDetailDTO')


const mongodbIdPattern = /^[0-9a-fA-F]{24}$/
const fs = require('fs');



const postController ={
    //create post 
    async create (req,res,next) {
        //validate post data
        const createPostSchema = Joi.object({
            title : Joi.string().required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            content: Joi.string().required(),
            photo: Joi.string()
        });

        const {error} = createPostSchema.validate(req.body);

        if (error) {
            return next(error)
        }
        const {title,author,content,photo} = req.body;
        //handle photo
        //1.read as 
        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),'base64')
        //2.allocate name
        const imagePath = `${Date.now()}-${author}.png`
        
        //3.save locally
         try{
            fs.writeFileSync(`storage/${imagePath}`,buffer)
         }
         catch(error){
            return next(error)
         }

         // save post in db
         let newPost;

         try{
             newPost = new Post({
                title, 
                author,
                content,
                photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`
            })
            await newPost.save()
         }
         catch(e){
            return next(e)
         }
         const postDto = new PostDTO(newPost)
        return  res.status(201).json({message: "post uploaded successfully", post: postDto})
       
        
    },
    // get all post
    async getAll (req,res,next){
       try{ 
        const posts = await Post.find({})

        const postDto = []

        for(let i=0 ; i<posts.length ;i++){
            const dto = new PostDTO(posts[i])
            postDto.push(dto)
        }

        return res.status(200).json({posts:postDto})
    }
    catch(error){
        return next(error)
    }
    },
    //get post by id 
    async getById(req, res, next) {
        // validate id
        // response
    
        const getByIdSchema = Joi.object({
          id: Joi.string().regex(mongodbIdPattern).required(),
        });
    
        const { error } = getByIdSchema.validate(req.params);
    
        if (error) {
          return next(error);
        }
    
        let post;
    
        const { id } = req.params;
    
        try {
          post = await Post.findOne({ _id: id }).populate("author");
        } catch (error) {
          return next(error);
        }
    
        const postDto = new PostDetailDTO(post);
    
        return res.status(200).json({ post: postDto });
      },
    // update post 
    async update(req, res, next) {
        // validate
        // ... (your validation code here)
      
        const { title, content, photo, author, postId } = req.body;
      
        // Find the post by postId
        let post;
        try {
          post = await Post.findOne({ _id: postId });
          if (!post) {
            return res.status(404).json({ message: 'Post not found' });
          }
        } catch (error) {
          return next(error);
        }
      
        if (photo) {
          // If there is a photo, delete the previous one and save the new one
          if (post.photoPath) {
            const previousPhoto = post.photoPath.split('/').at(-1);
      
            // delete photo
            fs.unlinkSync(`storage/${previousPhoto}`);
          }
      
          // Read the photo as buffer
          const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
          // Allocate a new name for the photo
          const imagePath = `${Date.now()}-${author}.png`;
      
          // Save the photo locally
          try {
            fs.writeFileSync(`storage/${imagePath}`, buffer);
          } catch (error) {
            return next(error);
          }
      
          // Update the post with the new photoPath
          await Post.updateOne({ _id: postId }, { title, content, photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}` });
        } else {
          // If there is no photo, simply update the title and content
          await Post.updateOne({ _id: postId }, { title, content });
        }
      
        return res.status(200).json({ message: 'Post updated successfully' });
      },
      
    //delete post 
    async delete (req,res,next){
        //validate id
        const deleteScheme = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required()
        })

        const { error } = deleteScheme.validate(req.params)

        if(error){
            return next(error)
        }

        const { id } = req.params
        try{
             await Post.deleteOne({_id:id})
        }
        catch(error){
            return next(error)
        }
        return res.status(200).json({message : "post deleted successfully"})
    }
}

module.exports = postController