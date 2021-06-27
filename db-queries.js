// Quest 2: Write a query (in mongo).
// 1. Fetch all the bookmarks by user
// Assuming for User with ID 10
db.feeds.aggregate([
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    { $lookup: { from: "bookmarks", localField: "_id", foreignField: "feedId", as: "bookmarks" }},
    { $match:  { "bookmarks": { $elemMatch : { userId: 10 }}}},
    { $project: { 
        "_id": 1,
        "title": 1,
        "desc": 1,
        "user._id": 1,
        "user.firstName": "$user.first_name",
        "user.lastName": "$user.last_name",
        "totalUpVotes": { $size: "$upVotes" }, 
        "isBookmarked": { $in: [10, "$bookmarks.userId"] }, 
        "isUpvote": { $in: [10, "$upVotes"] }
    }}
]);

// 2. List of feeds upVote by user
// Assuming for User with ID 10
db.feeds.aggregate([
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    { $lookup: { from: "bookmarks", localField: "_id", foreignField: "feedId", as: "bookmarks" }},
    { $match:  { "upVotes": { $elemMatch : { $eq: 10 } } } },
    { $project: { 
        "_id": 1,
        "title": 1,
        "desc": 1,
        "user._id": 1,
        "user.firstName": "$user.first_name",
        "user.lastName": "$user.last_name",
        "totalUpVotes": { $size: "$upVotes" }, 
        "isBookmarked": { $in: [10, "$bookmarks.userId"] }, 
        "isUpvote": { $in: [10, "$upVotes"] }
    }}
]);

// 3. List of feeds by client_id
// Assuming ClientId 31
db.feeds.aggregate([
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    { $lookup: { from: "bookmarks", localField: "_id", foreignField: "feedId", as: "bookmarks" }},
    { $match: { "client_id": 31 } },
    { $project: { 
        "_id": 1,
        "title": 1,
        "desc": 1,
        "user._id": 1,
        "user.firstName": "$user.first_name",
        "user.lastName": "$user.last_name",
        "totalUpVotes": { $size: "$upVotes" }, 
        "isBookmarked": { $in: [10, "$bookmarks.userId"] }, 
        "isUpvote": { $in: [10, "$upVotes"] }
    }}
]);