const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../middleware/validate');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const errors = [
      ...validate.string('Name', name, { maxLen: 50 }),
      ...validate.username(username),
      ...validate.email(email),
      ...validate.password(password),
    ];
    if (errors.length) {
      return res.status(400).json({ message: errors[0] });
    }

    const cleanName = validate.sanitize(name);

    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        message:
          userExists.email === email
            ? 'Email already exists'
            : 'Username already taken',
      });
    }

    const user = await User.create({
      name: cleanName,
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('[REGISTER ERROR]', error.message);
    res.status(500).json({ message: 'Registration failed, please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({
      $or: [{ email }, { username: email.toLowerCase().trim() }],
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        followers: user.followers.length,
        following: user.following.length,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[LOGIN ERROR]', error.message);
    res.status(500).json({ message: 'Login failed, please try again.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'followers following',
      'name username avatar'
    );
    res.json(user);
  } catch (error) {
    console.error('[GETME ERROR]', error.message);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) {
      const nameErrors = validate.string('Name', name, { maxLen: 50 });
      if (nameErrors.length) return res.status(400).json({ message: nameErrors[0] });
      user.name = validate.sanitize(name);
    }
    if (bio !== undefined) {
      const bioErrors = validate.string('Bio', bio, { maxLen: 150, required: false });
      if (bioErrors.length) return res.status(400).json({ message: bioErrors[0] });
      user.bio = validate.sanitize(bio);
    }
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('[UPDATE PROFILE ERROR]', error.message);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { language, anonymousModeEnabled, acceptedTermsVersion } = req.body;
    const user = await User.findById(req.user._id);

    if (language !== undefined) {
      if (!['en', 'es'].includes(language)) {
        return res.status(400).json({ message: 'Invalid language' });
      }
      user.language = language;
    }
    if (anonymousModeEnabled !== undefined) user.anonymousModeEnabled = anonymousModeEnabled;
    if (acceptedTermsVersion !== undefined) user.acceptedTermsVersion = acceptedTermsVersion;

    const updatedUser = await user.save();
    res.json({
      language: updatedUser.language,
      anonymousModeEnabled: updatedUser.anonymousModeEnabled,
      acceptedTermsVersion: updatedUser.acceptedTermsVersion,
    });
  } catch (error) {
    console.error('[UPDATE SETTINGS ERROR]', error.message);
    res.status(500).json({ message: 'Failed to update settings.' });
  }
};
