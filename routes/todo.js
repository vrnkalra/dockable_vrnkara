var express = require('express');
var router = express.Router();

const Todo = require('../models/todo');
const Team = require('../models/team');
const Channel = require('../models/channel');


/* GET home page. */
router.post('/list', async (req, res, next) => {
  // get all the todos for particular channel an team id which are status : false
  const {
    channelID,
    teamID,
    text,
    userID,
    channelName,
    domain,
    userName,
    command
  } = extractValues(req.body);


  try {

    let team = await Team.findOne({
      teamID
    })
    //todo : team does not exist    
    let channel = await Channel.findOne({
      channelID,
      teamId: team._id
    });
    //todo : channel does not exist
    const todoList = await Todo.find({
      // status: false,
      channelId: channel._id,
      // teamId: team._id
    })
    console.log(todoList);
    //todo : handling for no todo's
    let result = "";
    todoList.forEach((task, index) => {
      result += (index + 1) + ". " + task.text + "\n";
    })

    res.send({
      "response_type": "in_channel",
      "text": "List of pending tasks :",
      "attachments": [{
        "text": result,
      }]
    })

  } catch (e) {

    console.log("failed due to ")
    console.log(e)

    res.status(500).send({
      "response_type": "in_channel",
      "text": "Failed to add message to list",
    })

  }

});

router.post('/add', async (req, res, next) => {
  const {
    channelID,
    teamID,
    text,
    userID,
    channelName,
    domain,
    userName,
    command
  } = extractValues(req.body);

  try {
    let team = await Team.findOne({
      teamID
    })

    if (!team) {
      team = new Team({
        teamID,
        domain
      })
      await team.save();
    }

    let channel = await Channel.findOne({
      channelID,
      teamId: team._id
    });

    if (!channel) {
      channel = new Channel({
        channelID,
        channelName,
        teamId: team._id
      })
      await channel.save();
    }

    let todo = new Todo({
      channelId: channel._id,
      teamId: team._id,
      text
    })

    todo.save();

    res.send({
      "response_type": "in_channel",
      "text": "Successfully added to list.",
      "attachments": [{
        "text": text,
      }]
    })

  } catch (e) {

    console.log("failed due to ")
    console.log(e)

    res.status(500).send({
      "response_type": "in_channel",
      "text": "Failed to add message to list",
    })
  }
});

router.post('/mark', async (req, res, next) => {

  const {
    channelID,
    teamID,
    text,
    userID,
    channelName,
    domain,
    userName,
    command
  } = extractValues(req.body);

  res.send({
    "response_type": "in_channel",
    "text": "It's 80 degrees right now.",
    "attachments": [{
      "text": "Partly cloudy today and tomorrow"
    }]
  })
});

function extractValues(body) {

  // "command": "/listtodos"
  return {
    channelID: body.channel_id,
    teamID: body.team_id,
    text: body.text,
    userID: body.user_id,
    channelName: body.channel_name,
    domain: body.team_domain,
    userName: body.user_name,
    command: body.command
  }
}

module.exports = router;