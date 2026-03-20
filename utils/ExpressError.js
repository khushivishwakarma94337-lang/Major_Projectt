class ExpressError extends Error{
    constructor(status,message){
     super(message);
     this.status=status;
    //  this.message=this.message;
    }
}
module.exports=ExpressError;