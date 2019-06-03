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

    let team = await getTeam(teamID);

    if (!team) {
      team = await createTeam(teamID, domain);
    }

    let channel = await getChannel(channelID, team._id);
    if (!channel) {
      channel = await createChannel(channelID, channelName, team._id);
    }

    const todoList = await Todo.find({
      status: false,
      channelId: channel._id,
      teamId: team._id
    })
    console.log(todoList);
    let result = "";
    if (todoList.length > 0) {

      todoList.forEach((task, index) => {
        result += (index + 1) + ". " + task.text + "\n";
      })
    } else {
      result = "No TODOs"
    }

    res.send({
      "response_type": "in_channel",
      "text": "List of pending tasks :",
      "attachments": [{
        "text": result,
      }]
    })

  } catch (e) {

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
    let team = await getTeam(teamID);

    if (!team) {
      team = await createTeam(teamID, domain);
    }

    let channel = await getChannel(channelID, team._id);

    if (!channel) {
      channel = await createChannel(channelID, channelName, team._id);
    }

    await createTodo(channel._id, team._id, text);

    res.send({
      "response_type": "in_channel",
      "text": "Successfully added to list.",
      "attachments": [{
        "text": text,
      }]
    })

  } catch (e) {

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

  try {
    let team = await getTeam(teamID);
    if (!team) {
      team = await createTeam(teamID, domain);
    }

    let channel = await getChannel(channelID, team._id);
    if (!channel) {
      channel = await createChannel(channelID, channelName, team._id);
    }

    const todo = await Todo.findOneAndUpdate({
      text,
      channelId: channel._id,
      teamId: team._id,
      status: false
    }, {
      status: true
    }, {
      new: true
    });

    if (!todo) {
      res.status(200).send({
        "response_type": "in_channel",
        "text": "There is no such todo task. Please try again with a valid todo task.",
      });
    } else {
      res.status(200).send({
        "response_type": "in_channel",
        "text": "Task successfully marked as completed.",
      })
    }
  } catch (e) {

    console.log(e)

    res.status(500).send({
      "response_type": "in_channel",
      "text": "Failed to add message to list",
    })
  }
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

async function getTeam(teamID) {
  return Team.findOne({
    teamID
  });
}

async function createTeam(teamID, domain) {
  let team = new Team({
    teamID,
    domain
  });
  return team.save();
}

async function getChannel(channelID, teamId) {
  return Channel.findOne({
    channelID,
    teamId
  });
}

async function createChannel(channelID, channelName, teamId) {
  let channel = new Channel({
    channelID,
    channelName,
    teamId
  });
  return channel.save();
}

async function createTodo(channelId, teamId, text) {
  let todo = new Todo({
    channelId,
    teamId,
    text,
  })

  return todo.save();
}
module.exports = router;