const express = require('express');
const { default: mongoose } = require('mongoose');

const taskSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please Enter first Name"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Please Enter last Name"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "Please Enter City"],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, "Please Enter age"],
        maxLength: [3, "age limit"],
    },
    dateOfJoining: {
        type: Date,
        default: Date.now,
    },
    department: {
        type: String,
        required: [true, "Please Enter department"],
        trim: true,
    }
});

module.exports = mongoose.model("tasks", taskSchema);