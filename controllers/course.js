const User = require("../models/users");
const Course = require("../models/course");

exports.allCourses=(req,res,next)=>{
  Course.find({})
  .select('-rating.totalrating')
  .populate('instructorDetails','fullname email')
  .then(course=>{
    if(!course)
    {
      res.status(400).json("no course found");
    }
    res.status(200).json(course);
  })
  .catch(error=>{
    res.status(500).json("error in fetching allcourses", error);
  })
}

exports.categorywise=(req,res,next)=>{
  const categorywiseCourses = req.params.category;
  Course.find({category:categorywiseCourses})
  .select('-rating.totalrating')
  .populate('instructorDetails','fullname email')
  .then(course=>{
    if(!course)
    {
      res.status(400).json("no course found");
    }
    // console.log(categorywiseCourses);
    res.status(200).json(course);
  })
  .catch(error=>{
    res.status(500).json("error in fetching category-wise courses", error);
  })
}

exports.addtocart=(req,res,next)=>{
  const userId = req.userId;
  const courseId = req.params.courseid;

  // console.log(userId , courseId);
  Course.find(courseId)
  .then(course=>{
    if(!course)
    {
      return res.status(400).json('Course does not exist'); 
    }
    else
    {
      return User.findById(userId)
    }
  })
  .then(user=>{
    const index = user.cart.findIndex(courseid => courseId==courseid)
    if(index==-1)
    {
      user.cart.push(courseId);
      user.save();
    }
    else{
      return res.status(400).json('Already in cart');
    }
     return res.status(200).json('Added to cart');
    })
  .catch(err=>{
    console.log("error in adding to cart", err);
     res.status(400).json({ 'Error in adding to cart': err });
  })
  }

  exports.removefromcart=(req,res,next)=>{
    const userId =  req.userId;
    const courseId = req.params.courseid;
  
    User.findById(userId)
    .then(user=>{
      const index = user.cart.findIndex(courseid => courseId==courseid)
      if(index==-1)
      {
       return res.status(400).json('Not in cart');
      }
     else
     {
      user.cart.splice(index,1);
      user.save(); 
     }
     return res.status(200).json('Removed from cart');
    })
    .catch(err=>{
      console.log("error in removing from cart", err);
      res.status(400).json({ 'Error in removing from cart': err });
    })
    }

    exports.Cart =(req,res,next)=>{
      const userId = req.params.userid;
      User.findById(userId)
      // User.findById({'_id': '6182558da75d18d6f2964024'})
      .populate('cart')
      .exec()
      .then(user => {
        const course = user.cart;
        res.status(200).json({'Your Cart':course});
      })
    .catch(err=>{
      console.log("error in displaying cart", err);
      res.status(400).json({ 'Error in displaying cart': err });
    })
    }

    exports.addtofav=(req,res,next)=>{
      const userId = req.userId;
      const courseId = req.params.courseid;
    
      // console.log(userId , courseId);
      User.findById(userId)
      .then(user=>{
        const index = user.favourites.findIndex(courseid => courseId==courseid)
        if(index==-1)
        {
          user.favourites.push(courseId);
          user.save();
        }
        else{
          return res.status(400).json('Already in favourites');
        }
         return res.status(200).json('Added to favourites');
        })
      .catch(err=>{
        console.log("error in adding to favourites", err);
         res.status(400).json({ 'Error in adding to favourites': err });
      })
      }
    
      exports.removefromfav=(req,res,next)=>{
        const userId = req.userId;
        const courseId = req.params.courseid;
      
        User.findById(userId)
        .then(user=>{
          const index = user.cart.findIndex(courseid => courseId==courseid)
          if(index==-1)
          {
           return res.status(400).json('Not in favourites');
          }
         else
         {
          user.favourites.splice(index,1);
          user.save(); 
         }
         return res.status(200).json('Removed from favourites');
        })
        .catch(err=>{
          console.log("error in removing from favourites", err);
          res.status(400).json({ 'Error in removing from favourites': err });
        })
        }
    
        exports.fav =(req,res,next)=>{
          const userId = req.params.userid;
          User.findById(userId)
          .populate('favourites')
          .exec()
          .then(user => {
            const course = user.favourites;
            res.status(200).json({'Your favourites':course});
          })
        .catch(err=>{
          console.log("error in displaying favourites", err);
          res.status(400).json({ 'Error in displaying favourites': err });
        })
        }

        exports.buynow=(req,res,next)=>{
          const courseId = req.params.courseid;
          const userid = req.userId;
          User.findById(userid)
          .then(user=>{
            const cartindex = user.cart.findIndex(courseid => courseId==courseid)
            const mycoursesindex = user.mycourses.findIndex(courseid => courseId==courseid)
            if(mycoursesindex != -1){
              return res.status(400).json("you have already bought the course");
            }
            if(cartindex != -1){
              user.cart.pull(courseId);
              user.mycourses.push(courseId);
              user.save();
            }
             return res.status(200).json("payment successful");
          })
          .catch(err=>{
            console.log(err);
            res.status(400).json({ 'payment unsuccessful': err });
          })
        }

        exports.buyfromcart=(req,res,next)=>{
          let totalprice=0;
          const userid = req.params.userid;
          User.findById(userid)
          .populate('cart')
          .then(user=>{
            if(user.cart.length == 0)
            {
              res.status(400).json('Cart is empty');
            }
            const length =  user.cart.length;
            for(var i=0;i<length;i++)
            {
              user.mycourses.push(user.cart[i]);
              totalprice += parseInt(user.cart[i].price);
            }
            user.cart=[];
            user.save();
          })
          .then(result=>{
            return res.status(200).json({"payment successful":totalprice});
          })
          .catch(err=>{
            console.log(err);
            res.status(400).json({ 'payment unsuccessful': err });
          })
        }

        exports.rating=(req,res,next)=>{
          const courseid=req.params.courseid;
          const userid = req.user;
          let total=0;
          const rate = req.body.rate;
          
          Course.findById(courseid)
          .then(course=>{
            course.rating.totalrating.push(rate);
            course.rating.totalrating.forEach(r=>{
            total+= r;
            })
            course.rating.avgrating = total/(course.rating.totalrating.length);
            // console.log(course.rating.avgrating);
            course.save();
            return res.status(200).json("rating updated");
          })
          .catch(err=>{
            console.log(err);
            res.status(400).json({ 'error in rating': err });

          })

        }

        exports.addreviews=(req,res,next)=>{
          const courseid=req.params.courseid;
          const userid = req.user;
          const userreview = req.body.userreview;
          Course.findById(courseid)
          .then(course=>{
            course.reviews[course.reviews.length] = {userreview:userreview, user:userid};
            course.save();
            return res.status(200).json("review added");
          })
          .catch(err=>{
            console.log(err);
            res.status(400).json({ 'error in adding review': err });

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
          conditions.rating = {'avgrating' :query.rating};
        }
        if (query.language) {
          conditions.language = query.language;
        }
        console.log(conditions);
      Course.find(conditions)
      .select('-rating.totalrating')
        .populate('instructorDetails','fullname email')
        .then(course=>{
          if(!course)
          {
            console.log("no course found");
            res.status(400).json("no course found");
          }
          res.status(200).json(course);
        })
        .catch(error=>{
          console.log(error);
          res.status(500).json("error in fetching courses");
        })
        }