const User = require("../../model/User/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utilis/generateToken");
const appErr = require("../../utilis/appErr");
const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");
const Category=require("../../model/Category/Category");
const userRegisterCtrl = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(appErr("User already exists", 500));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    return res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(appErr(err.message, 500));
  }
};

const userLoginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return next(appErr("User not found", 500));
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      userFound.password
    );
    if (!isPasswordMatched) {
      return next(appErr("Invalid credentials", 500));
    }
    return res.json({
      status: "success",
      data: {
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
        token: generateToken(userFound._id),
      },
    });
  } catch (err) {
    return next(appErr(err.message, 500));
  }
};

const userProfileCtrl = async (req, res, next) => {
  const { id } = req.authUserId;
  console.log(id);
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(appErr("User not found", 403));
    }
    return res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(appErr(err.message, 500));
  }
};

const whoViewedMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const userWhoViewed = await User.findById(req.authUserId.id);
    if (!user || !userWhoViewed) {
      return next(appErr("User not found", 403));
    }
    console.log(user);
    console.log(userWhoViewed);
    const isUserViewed = user.viewers.find(
      (viewer) => viewer.toString() === userWhoViewed._id.toString()
    );
    console.log(isUserViewed);
    if (isUserViewed) return next(appErr("User already viewed", 403));
    else {
      user.viewers.push(userWhoViewed._id);
      await user.save();
    }

    return res.json({
      status: "success",
      message: "successfully viewed",
    });
  } catch (err) {
    next(appErr(err.message, 500));
  }
};

const profilePhotoUploadCtrl = async (req, res, next) => {
  try {
    const { id } = req.authUserId;
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return next(appErr("User not found", 403));
    }
    if (userToUpdate.isBlocked) {
      return next(appErr("Action is Forbidden", 403));
    }

    if (req.file) {
      await User.findByIdAndUpdate(id, {
        $set: {
          profilePhoto: req.file.path,
        },
      });
    }

    return res.json({
      status: "success",
      message: "profile photo uploaded successfully",
    });
  } catch (err) {
    next(appErr(err.message, 500));
  }
};

const followingCtrl = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const userFollowing = await User.findById(req.authUserId.id);
    if (userToFollow && userFollowing) {
      const isUserFollowing = userToFollow.followers.find(
        (follower) => follower.toString() === userFollowing._id.toString()
      );
      if (isUserFollowing)
        return next(appErr("you are already following", 403));
      else {
        userToFollow.followers.push(userFollowing._id);
        userFollowing.following.push(userToFollow._id);
        await userToFollow.save();
        await userFollowing.save();
        return res.json({
          status: "success",
          message: "user followed successfully",
        });
      }
    } else return next(appErr("User not found", 403));
  } catch (err) {
    return next(appErr(err.message, 500));
  }
};

const unFollowCtrl = async (req, res, next) => {
  try {
    const userToUnFollow = await User.findById(req.params.id);
    const userFollowing = await User.findById(req.authUserId.id);
    if (userToUnFollow && userFollowing) {
      const isUserFollowing = userToUnFollow.followers.find(
        (follower) => follower.toString() === userFollowing._id.toString()
      );
      if (!isUserFollowing)
        return next(appErr("you are already not following the user", 403));
      else {
        userToUnFollow.followers = userToUnFollow.followers.filter(
          (follower) => follower.toString() !== userFollowing._id.toString()
        );
        userFollowing.following = userFollowing.following.filter(
          (following) => following.toString() !== userToUnFollow._id.toString()
        );
        await userToUnFollow.save();
        await userFollowing.save();
        return res.json({
          status: "success",
          message: "user unfollowed successfully",
        });
      }
    } else return next(appErr("User not found", 403));
  } catch (err) {
    return next(appErr(err.message, 500));
  }
};

const blockCtrl = async (req, res, next) => {
  try {
    const userToBeBlocked = await User.findById(req.params.id);
    const userBlocking = await User.findById(req.authUserId.id);
    if (userToBeBlocked && userBlocking) {
      const IsUserBlocked = userBlocking.blocked.find(
        (blocked) => blocked.toString() === userToBeBlocked._id.toString()
      );
      if (IsUserBlocked) return next(appErr("User is already blocked", 403));
      else {
        userBlocking.blocked.push(userToBeBlocked._id);
        await userBlocking.save();
        return res.json({
          status: "success",
          message: "user blocked successfully",
        });
      }
    } else return next(appErr("User not found", 403));
  } catch (err) {
    return next(appErr(err.message, 500));
  }
};

const unBlockCtrl = async (req, res, next) => {
  try {
    const userToBeUnBlocked = await User.findById(req.params.id);
    const userBlocking = await User.findById(req.authUserId.id);
    if (userToBeUnBlocked && userBlocking) {
      const IsUserBlocked = userBlocking.blocked.find(
        (blocked) => blocked.toString() === userToBeUnBlocked._id.toString()
      );
      if (!IsUserBlocked)
        return next(appErr("User is already not blockeded", 403));
      else {
        userBlocking.blocked = userBlocking.blocked.filter(
          (blocked) => blocked.toString() !== userToBeUnBlocked._id.toString()
        );
        await userBlocking.save();
        return res.json({
          status: "success",
          message: "user unblocked successfully",
        });
      }
    } else return next(appErr("User not found", 403));
  } catch (err) {
    return next(appErr(err.message, 500));
  }
};

const usersCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.authUserId.id);
    if (!user) return next(appErr("User not found", 403));
    res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(appErr(err.message, 500));
  }
};

const userDeleteCtrl = async (req, res, next) => {
  try{
    const user = await User.findById(req.authUserId.id);
    if (!user) return next(appErr("User not found", 403));
    await Post.deleteMany({user:user._id});
    await Comment.deleteMany({user:user._id});
    await Category.deleteMany({user:user._id});
    await User.deleteOne({_id:user._id});
    return res.json({
      status: "success",
      message: "user deleted successfully",
    })
  }catch(err){
    return next(appErr(err.message, 500));
  }
};

const userUpdateCtrl = async (req, res, next) => {
  const { email, firstName, lastName } = req.body;
  try {
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) return next(appErr("Email already taken", 403));
    }

    const user = await User.findByIdAndUpdate(
      req.authUserId.id,
      { email, firstName, lastName },
      { new: true, runValidators: true }
    );
    return res.json({
      status: "success",
      message: "user updated successfully",
      data: user,
    });
  } catch (err) {
    return next(appErr(err.message, 500));
  }
};

const updatePasswordCtrl=async(req,res,next)=>{
  try{
    const {password}=req.body;
    if(!password) return next(appErr("password is required",403));
    const salt=await bcrypt.genSalt(10);
    const hashedPass=await bcrypt.hash(password,salt);
    await User.findByIdAndUpdate(req.authUserId.id,{password:hashedPass},{new:true,runValidators:true});
    return res.json({
      status:"success",
      message:"password updated successfully"
    })
  }catch(err){
    return next(appErr(err.message,500));
  }
}
const adminBlockUser = async (req, res, next) => {
  try {
    const userToBeBlocked = await User.findById(req.body.id);
    if (!userToBeBlocked) return next(appErr("User not found", 403));
    else {
      if (userToBeBlocked.isBlocked)
        return next(appErr("User is already blocked", 403));
      userToBeBlocked.isBlocked = true;
      await userToBeBlocked.save();
      return res.json({
        status: "success",
        message: "user blocked successfully",
      });
    }
  } catch (err) {
    return next(appErr(err.message, 500));
  }
};

const adminUnBlockUser = async (req, res, next) => {
  try {
    const userToBeUnBlocked = await User.findById(req.body.id);
    if (!userToBeUnBlocked) return next(appErr("User not found", 403));
    else {
      if (!userToBeUnBlocked.isBlocked)
        return next(appErr("User is already not blocked", 403));
      userToBeUnBlocked.isBlocked = false;
      await userToBeUnBlocked.save();
      return res.json({
        status: "success",
        message: "user unblocked successfully",
      });
    }
  } catch (err) {
    return next(appErr(err.message, 500));
  }
};

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  userProfileCtrl,
  usersCtrl,
  userDeleteCtrl,
  userUpdateCtrl,
  profilePhotoUploadCtrl,
  whoViewedMyProfile,
  followingCtrl,
  unFollowCtrl,
  blockCtrl,
  unBlockCtrl,
  adminBlockUser,
  adminUnBlockUser,
  updatePasswordCtrl
};
