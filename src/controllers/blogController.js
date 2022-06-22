const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const moment = require('moment');


const createNewBlog = async function(req,res){
    try{

    let blog =  req.body
    let author_Id = blog.authorId
    let author = await authorModel.findById(author_Id)

    if(!author)  return res.status(400).send({status: false,msg: "Author not found!",});

    let {category, tags, subcategory} = blog
  
    if(!category) return res.status(400).send({status: false, msg: "category required!"});

    if(!tags) return res.status(400).send({status:false, masg: "require tags!"});

    if(!subcategory) return res.status(400).send({status:false, masg: "require subcategory!"});      
        
    let blogCreated = await blogModel.create(blog)
    return res.status(201).send ({status: true, data: blogCreated });
    }catch(err){
        //for getting server error 
        return res.status(500).send({status: false, msg:err.message})
    }
}


const updateBlog = async function(req, res) {
    try {
        const blogId = req.params.blogId
        const blog = await blogModel.findById(blogId)

        if(!blog)   return res.status(404).send({status : false, msg : "Blog Id is incorrect"})
        if(blog.isDeleted == true)  return res.status(404).send({status : false, msg : "Blog doesn't exist"})
        if(Object.keys(req.body).length == 0)   return res.status(400).send({status : false, msg : "Empty body for update"})
    
        for(const key in req.body){
            console.log(key);
            if(typeof (req.body[key]) == "object"){
                req.body[key].push(...blog[key]);
            }
        }

        let query = {...req.body, isPublished : true, publishedAt : moment().format('YYYY-MM-DDTss:mm:h')}
        const updatedBlog = await blogModel.findOneAndUpdate({_id : blogId}, query, {new : true})

        return res.status(200).send ({status: true, data: updatedBlog });
    } catch (error) {
        return res.status(500).send ({status: false, msg: error.message });
    }
}


const deleteBlogByParams = async function(req,res){
try{
    
    const queryParams = req.query
    //let author = req.query.authorId
    //let authorId = await authorModel.findById(author);

    if(!queryParams) return res.status(400).send({status: false, msg: "no query params recived"})

    const {authorId, tags, subcategory,category, ispublished } = queryParams

    // if (!authorId){return res.status(404).send({status: false, msg: "Blog document does not exist"})
    // }

    let deleteBlog = await authorModel.findByIdAndDelete({_id: authorId}, {new: true});
    res.send({status: true, data: deleteBlog})
}catch(err){
    res.status(500).send({status: false, msg:err.message})
}
}


module.exports = {
    createNewBlog,
    updateBlog,
    deleteBlog,
    deleteBlogByParams
}