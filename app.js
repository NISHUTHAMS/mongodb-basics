// load env variables FIRST
require('dotenv').config();

const mongoose = require('mongoose');

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected successfully'))
  .catch((e) => console.log('Connection error:', e));

// schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  isActive: Boolean,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

// model
const User = mongoose.model('User', userSchema);

async function runQueryExamples() {
  try {
    // CREATE
    const newUser = await User.create({
      name: 'Updated User',
      email: 'updatedUser@gmail.com',
      age: 26,
      isActive: false,
      tags: ['designer']
    });
    console.log('Created new user:', newUser);

    // READ
    const allUsers = await User.find();
    console.log('All Users:', allUsers);

    const inactiveUsers = await User.find({ isActive: false });
    console.log('Inactive Users:', inactiveUsers);

    const getJohnDoeUser = await User.findOne({ name: 'John Doe' });
    console.log('John Doe:', getJohnDoeUser);

    const userById = await User.findById(newUser._id);
    console.log('User by ID:', userById);

    const selectedFields = await User.find().select('name email');
    console.log('Selected Fields:', selectedFields);

    const limitedUsers = await User.find().limit(5).skip(1);
    console.log('Limited Users:', limitedUsers);

    const sortedUsers = await User.find().sort({ age: 1 });
    console.log('Sorted Users:', sortedUsers);

    const countDocuments = await User.countDocuments({ isActive: false });
    console.log('Inactive Count:', countDocuments);

    // UPDATE
    const updatedUser = await User.findByIdAndUpdate(
      newUser._id,
      {
        $set: { age: 100 },
        $push: { tags: 'updated' }
      },
      { new: true }
    );
    console.log('Updated User:', updatedUser);

    // DELETE
    const deletedUser = await User.findByIdAndDelete(newUser._id);
    console.log('Deleted User:', deletedUser);

  } catch (e) {
    console.log('Error ->', e);
  } finally {
    await mongoose.connection.close();
  }
}

runQueryExamples();
