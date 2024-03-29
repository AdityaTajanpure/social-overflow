const express = require("express");
const auth = require("../../middlewares/jwt_verifier");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");
const router = express.Router();
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

//* @route   GET api/profile/me
//* @desc    Get current users profile
//* @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for this user",
      });
    } else {
      return res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//* @route   POST api/profile
//* @desc    Create or update a user profile
//* @access  Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build Profile Object

    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.company ??= company;
    profileFields.website ??= website;
    profileFields.location ??= location;
    profileFields.bio ??= bio;
    profileFields.status ??= status;
    profileFields.githubusername ??= githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((e) => e.trim());
    }

    //Initialize social array
    profileFields.social = {};
    profileFields.social.youtube ??= youtube;
    profileFields.social.twitter ??= twitter;
    profileFields.social.facebook ??= facebook;
    profileFields.social.linkedin ??= linkedin;
    profileFields.social.instagram ??= instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

//* @route   GET api/profile
//* @desc    Get all profiles
//* @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//* @route   GET api/profile/user/:user_id
//* @desc    Get all profiles
//* @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile Not Found " });
    }
    res.json(profile);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//* @route   DELETE api/profile
//* @desc    Delete profile and posts
//* @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    //!Removing posts
    await Post.deleteMany({ user: req.user.id });
    //!Removing profile
    await Profile.findOneAndRemove({
      user: req.user.id,
    });
    //!Removing user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User removed successfully" });
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//* @route   PUT api/profile/experience
//* @desc    Add profile experience
//* @access  Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, company, location, from, to, current, description } =
        req.body;

      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      };

      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message, err);
      res.status(500).send("Server error");
    }
  }
);

//* @route   DELETE api/profile/experience/:exp_id
//* @desc    Delete experience from profile
//* @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index

    const removeIndex = profile.experience
      .map((exp) => exp.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message, err);
    res.status(500).send("Server error");
  }
});

//* @route   PUT api/profile/education
//* @desc    Add profile education
//* @access  Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldOfStudy", "Field of Study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { school, degree, fieldOfStudy, from, to, current, description } =
        req.body;

      const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description,
      };

      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message, err);
      res.status(500).send("Server error");
    }
  }
);

//* @route   DELETE api/profile/education/:exp_id
//* @desc    Delete education from profile
//* @access  Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index

    const removeIndex = profile.education
      .map((edu) => edu.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message, err);
    res.status(500).send("Server error");
  }
});

//* @route   GET api/profile/github/:username
//* @desc    Get user repos from github
//* @access  Public

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: {
        "User-Agent": "node.js",
      },
    };

    request(options, (err, response, body) => {
      if (err) console.error(err);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message, err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
