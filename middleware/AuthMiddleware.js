
const Auth = (req,res,next)=>{
        console.log(req);
        console.log("call route auth middle ware");
        next();
}

module.exports = Auth;