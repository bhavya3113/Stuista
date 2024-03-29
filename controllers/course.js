const User = require("../models/users");
const Course = require("../models/course");
const Instructor = require("../models/instructor");
const path =require("path");
const fs = require("fs");
const pdf = require("pdfkit");

exports.allCourses=(req,res,next)=>{
  Course.find({})
  .select(' -instructorId')
  .populate('eachrating.user',{fullname:1,imageUrl:1})
  .then(course=>{
    if(!course)
    {
      res.status(400).json({Error:"no course found"});
    }
    res.status(200).json({course:course});
  })
  .catch(error=>{
    // console.log(error);
    res.status(500).json({Error:"error in fetching allcourses"});
  })
}

exports.categorywise=(req,res,next)=>{
  const categorywiseCourses = req.params.category;
  Course.find({category:categorywiseCourses}) 
  .select(' -instructorId')
  .populate('eachrating.user',{fullname:1,imageUrl:1})
  .then(course=>{
    if(!course)
    {
      res.status(400).json({Error:"no course found"});
    }
    // console.log(categorywiseCourses);
    res.status(200).json({course:course});
  })
  .catch(error=>{
    res.status(500).json({Error:"error in fetching category-wise courses"});
  })
}


exports.viewCourse=(req,res,next)=>{
  const courseId = req.params.courseid;
  Course.findById(courseId)
  .select(' -instructorId')
  .populate('eachrating.user',{fullname:1,imageUrl:1})
  .then(course=>{
    if(!course)
    {
      res.status(400).json({Error:"no course found"});
    }
    res.status(200).json({course:course});
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({Error:"error in fetching course"});
  })
}


exports.addtocart=(req,res,next)=>{
  const userId = req.userId;
  const courseId = req.params.courseid;

  // console.log(userId , courseId);
  Course.findById(courseId)
  .then(course=>{
    if(!course)
      return res.status(400).json({Error:'Course does not exist'}); 
     Instructor.findOne({'details':userId})
    .then(instructor=>{
    if(instructor)
    {
      const courseindex = instructor.course.findIndex(courseid => courseId==courseid);
      if(courseindex !== -1)
        return res.status(400).json({Error:'You can not add your own course to your cart'}); 
    }
   User.findById(userId)
  .then(user=>{
    if(!user)
    {
      return res.status(400).json({Error:'User does not exist'}); 
    }
    const index = user.cart.findIndex(courseid => courseId==courseid)
    if(index==-1)
    {
      user.cart.push(courseId);
      user.save();
    }
    else{
      return res.status(400).json({Error:'Already in cart'});
    }
     return res.status(200).json({message:'Added to cart'});
    })
  })})
  .catch(err=>{
    // console.log("error in adding to cart", err);
     res.status(400).json({Error: 'Error in adding to cart' });
  })
  }

  exports.removefromcart=(req,res,next)=>{
    const userId =  req.userId;
    const courseId = req.params.courseid;
  
    User.findById(userId)
    .then(user=>{
      if(!user)
      {
        return res.status(400).json({Error:'User does not exist'}); 
      }
      const index = user.cart.findIndex(courseid => courseId==courseid)
      if(index==-1)
      {
       return res.status(400).json({Error:'Not in cart'});
      }
      user.cart.splice(index,1);
      user.save(); 
     return res.status(200).json({message:'Removed from cart'});
    })
    .catch(err=>{
      // console.log("error in removing from cart", err);
      res.status(400).json({Error: 'Error in removing from cart'});
    })
    }

    exports.Cart =(req,res,next)=>{
      const userId = req.userId;
      let totalprice=0;
      User.findById(userId)
      // User.findById({'_id': '6182558da75d18d6f2964024'})
      .populate('cart')
      .exec()
      .then(user => {
        if(!user)
      {
        return res.status(400).json({Error:'User not found'}); 
      }
        const course = user.cart;
        const length = user.cart.length;
        for(var i=0;i<length;i++)
        {
          totalprice += user.cart[i].price;
        }
        res.status(200).json({'YourCart':course,'length':length,'price':totalprice});
      })
    .catch(err=>{
      console.log("error in displaying cart", err);
      res.status(400).json({Error: 'Error in displaying cart'});
    })
    }

    exports.addtofav=(req,res,next)=>{
      const userId = req.userId;
      const courseId = req.params.courseid;
    
      // console.log(userId , courseId);
      Course.findById(courseId)
      .then(course=>{
        if(!course)
          return res.status(400).json({Error:'Course does not exist'}); 
      User.findById(userId)
      .then(user=>{
        if(!user)
        {
          return res.status(400).json({Error:'User does not exist'}); 
        }
        const index = user.favourites.findIndex(courseid => courseId==courseid)
        if(index==-1)
        {
          user.favourites.push(courseId);
          user.save();
        }
        else{
          return res.status(400).json({Error:'Already in favourites'});
        }
         return res.status(200).json({message:'Added to favourites'});
        })
      })
      .catch(err=>{
        // console.log("error in adding to favourites", err);
         res.status(400).json({Error: 'Error in adding to favourites' });
      })
      }
    
      exports.removefromfav=(req,res,next)=>{
        const userId = req.userId;
        const courseId = req.params.courseid;
      
        User.findById(userId)
        .then(user=>{
          if(!user)
          {
             return res.status(400).json('User does not exist'); 
          }
          const index = user.favourites.findIndex(courseid => courseId==courseid)
          if(index==-1)
          {
           return res.status(400).json({Error:'Not in favourites'});
          }
          user.favourites.splice(index,1);
          user.save(); 
          return res.status(200).json({Error:'Removed from favourites'});
        })
        .catch(err=>{
          // console.log("error in removing from favourites", err);
          res.status(400).json({Error: 'Error in removing from favourites'});
        })
        }
    
        exports.fav =(req,res,next)=>{
          const userId = req.userId;
          User.findById(userId)
          .populate('favourites')
          .exec()
          .then(user => {
            if(!user)
            {
              return res.status(400).json({Error:'User not found'}); 
            }
            const course = user.favourites;
            res.status(200).json({'favourites':course});
          })
        .catch(err=>{
          // console.log("error in displaying favourites", err);
          res.status(400).json({Error: 'Error in displaying favourites'});
        })
        }

        exports.buynow=(req,res,next)=>{
          const courseId = req.params.courseid;
          const userid = req.userId;

          Instructor.findOne({'details':userid})
          .then(instructor=>{
            if(instructor)
            {
              const courseindex = instructor.course.findIndex(courseid => courseId==courseid);
              if(courseindex !== -1)
                return res.status(400).json({Error:'You can not buy your own course'}); 
            }
          User.findById(userid)
          .then(user=>{
            if(!user)
            {
              return res.status(400).json({Error:'User not found'}); 
            }
            const cartindex = user.cart.findIndex(courseid => courseId==courseid)
            const mycoursesindex = user.mycourses.findIndex(courseid => courseId==courseid)
            if(mycoursesindex !== -1)
            {
              return res.status(400).json({Error:"you have already bought the course"});
            }
            if(cartindex !== -1)
            {
              user.cart.pull(courseId);
            }
            user.mycourses.push(courseId);
            user.save();
             return res.status(200).json({message:"payment successful"});
          }) })
          .catch(err=>{
            // console.log(err);
            res.status(400).json({Error:'payment unsuccessful'});
          })
        }

        exports.buyfromcart=(req,res,next)=>{
          let totalprice=0;
          const userid = req.userId;
          User.findById(userid)
          .populate('cart')
          .then(user=>{
            if(!user)
            {
              return res.status(400).json({Error:'User not found'}); 
            }
            if(user.cart.length == 0)
            {
              return res.status(400).json({Error:'Cart is empty'});
            }
            const length =  user.cart.length;
            for(var i=0;i<length;i++)
            {
              user.mycourses.push(user.cart[i]);
              totalprice += user.cart[i].price;
            }
            user.cart=[];
            user.save();
            return res.status(200).json({message:"payment successful",totalprice:totalprice});
          })
          .catch(err=>{
            // console.log(err);
            res.status(400).json({Error: 'payment unsuccessful'});
          })
        }

        exports.rateandreview=(req,res,next)=>{
          const courseId=req.params.courseid;
          const userid = req.userId;
          let total=0;
          const r = req.body.rate;
          const userreview = req.body.userreview;
          

          Instructor.findOne({'details':userid})
          .then(instructor=>{
            if(instructor)
            {
              const courseindex = instructor.course.findIndex(courseid => courseId==courseid);
              if(courseindex !== -1)
              return res.status(400).json({Error:'You can not rate and review your own course'});
            }
              return User.findById(userid);
            })
            .then(user=>{

              if(!user)
              return res.status(400).json({Error:"User not found"});
              const mycoursesindex = user.mycourses.findIndex(courseid => courseId==courseid)
              if(mycoursesindex == -1)
              {
                return res.status(400).json({Error:"Can't rate or review. Buy first."});
              }
              else
              return Course.findById(courseId)
            })
            .then(course=>{
              if(!course)
              return res.status(400).json({Error:'Course does not exist'}); 
              else
              {
                // console.log(course.rating.eachrating);
            const ratingindex = course.eachrating.findIndex(i=>(i.user)==userid)
            if(ratingindex == -1)
                course.eachrating[course.eachrating.length] = {user:userid, rate:r,userreview:userreview};
            else
              course.eachrating[ratingindex] = {user:userid, rate:r,userreview:userreview};
              // console.log(course.eachrating);
            
            course.eachrating.forEach(r=>{
                total+=r.rate;
                })
              // console.log(total);
              course.avgrating = total/(course.eachrating.length);
                // console.log(course.avgrating);
              course.save();

              return res.status(200).json({message:"rating and review added",rating:course.avgrating,userreview:userreview}); 
            }
            })
          .catch(err=>{
            console.log(err);
            res.status(400).json({Error: 'error in rating or reviewing'});
          })
        }


      exports.filter=(req,res,next)=>{
         
        const query = req.query;
          
        const conditions = {};
        if (query.category) {
           conditions.category = query.category;
        }
        if (query.duration) {
          conditions.duration = query.duration;
        }
        if (query.price) {
          conditions.price = {$lte:query.price};
        }
        if (query.rating) {
          
          conditions.avgrating = {$gte:query.rating};
          // conditions.rating = {query.rating};
          // conditions.rating.avgrating={}
        }
        if (query.language) {
          conditions.language = query.language;
        }
        // console.log(conditions);
      Course.find(conditions)
      .select(' -instructorId')
      .populate('eachrating.user',{fullname:1,imageUrl:1})
      .then(course=>{
      if(!course)
      {
        res.status(400).json({Error:"no course found"});
      }
      res.status(200).json({course:course});
     })
      .catch(error=>{
       // console.log(error);
      res.status(500).json({Error:"error in fetching allcourses"});
     })
     
        }

        exports.search=(req,res,next)=>{
          const text = req.body.text;
          Course.find({ title: { $regex: text, $options: "xi"} })
          .select(' -instructorId')
          .populate('eachrating.user',{fullname:1,imageUrl:1})
          .then(course=>{
            if(!course)
            {
              res.status(400).json({Error:"no course found"});
            }
            res.status(200).json({course:course});
          })
          .catch(error=>{
            console.log(error);
            res.status(500).json({Error:"error in fetching courses"});
          })
        }

        exports.syllabus=(req,res,next)=>{
          const courseid = req.params.courseid;

          Course.findById(courseid)
          .then(course=>{
            if(!course)
            return res.status(400).json({Error:"No course Found"});
            else{

              const syllabusname="syllabus.pdf";
              const syllabuspath = path.join('syllabus', syllabusname); 
  
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition','inline');
              const syllabuspdf = new pdf();

              syllabuspdf.pipe(fs.createWriteStream(syllabuspath));

              syllabuspdf.pipe(res);
              syllabuspdf.fontSize(26).text(course.title,{align:'center'});
              syllabuspdf.moveDown();
              syllabuspdf.fontSize(18).text(`Course by ${course.instructorName}` );
              syllabuspdf.moveDown();
              syllabuspdf.fontSize(18).text('SYLLABUS',{align:'center'});
              syllabuspdf.moveDown();
              syllabuspdf.text('Topic - 1');
              syllabuspdf.text('details');
              syllabuspdf.moveDown();
              syllabuspdf.text('Topic - 2');
              syllabuspdf.text('details');
              syllabuspdf.moveDown();
              syllabuspdf.text('Topic - 3');
              syllabuspdf.text('details');
              syllabuspdf.moveDown();
              syllabuspdf.text('Topic -4');
              syllabuspdf.text('details');
              syllabuspdf.end();
            }
          })
          .catch(err=>{
            // console.log(err);
            return res.status(400).json({Error:"Error in generating pdf"});
          })
        }