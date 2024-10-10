const UserModel = require("../models/Users");

function genUsername(name) {
  const formattedName = name.toLowerCase().replace(/\s+/g, "_");
  const randomNumber = Math.floor(Math.random() * 90000) + 10000; // 5 digits
  return `${formattedName}${randomNumber}`;
}

async function findUniqueUsername(name, custom_name, attempts) {
  let attemptCount = 0;
  const uniqueCustomName = await UserModel.findOne({ username: custom_name });

  if (!uniqueCustomName) {
    return custom_name;
  }

  console.log("Matching username already found. Finding alternative");
  while (attemptCount < attempts) {
    const username = genUsername(name);
    const existingUser = await UserModel.findOne({ username: username });

    if (!existingUser) {
      return username;
    } else {
      attemptCount++;
    }
  }
  throw new Error("Can't find a username");
}

async function addAUser(name, age, cust_name) {
  try {
    const username = await findUniqueUsername(name, cust_name, 10);
    console.log(`username is ${username}`);
    const newUser = new UserModel({
      name: name,
      age: age,
      username: username,
    });

    await newUser.save();
    console.log("User created successfully:", newUser);
  } catch (err) {
    console.error("Error creating user:", err);
  }
}

// Export the functions
module.exports = {
  genUsername,
  findUniqueUsername,
  addAUser,
};
