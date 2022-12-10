"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const YTVideoOverviewSchema = new Schema(
    {
    videoId: {
        type: String,
    },
    title: {
        type: String,
    },
    thumbnailUrl: {
        type: String,
    },
    duration: {
        type: String,
    },
    mainPlaylist: {
        type: String,
    },
    viewsUntilThisRecord: {
        type: String,
    },
    authorChannel: {
        type: String,
    },
    rawTimeSincePubDate: {
        type: String,
    }
    },
    {
    timestamps: true,
    versionKey: false,
    }
    );

module.exports = mongoose.model("YTVideoOverview", YTVideoOverviewSchema);
