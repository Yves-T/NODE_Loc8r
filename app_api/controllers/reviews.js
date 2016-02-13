var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var logger = require('./../../util/logger');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.reviewsCreate = function (req, res) {

    if (req.params.locationid) {
        console.log('location id');
        console.log(req.params.locationid);
        Loc
            .findById(req.params.locationid)
            .select('reviews')
            .exec(
                function (err, location) {
                    if (err) {
                        logger.error('reviews create error:', err);
                        sendJsonResponse(res, 400, err);
                    } else {
                        logger.info('reviews create error:', err);
                        doAddReview(req, res, location);
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
};

var doAddReview = function (req, res, location) {
    if (!location) {
        sendJsonResponse(res, 404, "locationid not found");
    } else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save(function (err, location) {
            var thisReview;
            if (err) {
                logger.error('do add review error:', err);
                sendJsonResponse(res, 400, err);
            } else {
                logger.info('do add review error:', err);
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, thisReview);
            }
        });
    }
};

var doSetAverageRating = function (location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for (i = 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function (err) {
            if (err) {
                logger.error('do set average rating error:', err);
            } else {
                logger.info("Average rating updated to", ratingAverage);
            }
        });
    }
};

var updateAverageRating = function (locationid) {
    console.log("Update rating average for", locationid);
    Loc
        .findById(locationid)
        .select('reviews')
        .exec(
            function (err, location) {
                if (!err) {
                    doSetAverageRating(location);
                } else {
                    logger.error('update average rating error:', err);
                }
            });
};

module.exports.reviewsReadOne = function (req, res) {
    console.log("Getting single review");
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc
            .findById(req.params.locationid)
            .select('name reviews')
            .exec(
                function (err, location) {
                    console.log(location);
                    var response, review;
                    if (!location) {
                        sendJsonResponse(res, 404, {
                            "message": "locationid not found"
                        });
                        return;
                    } else if (err) {
                        sendJsonResponse(res, 400, err);
                        return;
                    }
                    if (location.reviews && location.reviews.length > 0) {
                        review = location.reviews.id(req.params.reviewid);
                        if (!review) {
                            sendJsonResponse(res, 404, {
                                "message": "reviewid not found"
                            });
                        } else {
                            response = {
                                location: {
                                    name: location.name,
                                    id: req.params.locationid
                                },
                                review: review
                            };
                            sendJsonResponse(res, 200, response);
                        }
                    } else {
                        sendJsonResponse(res, 404, {
                            "message": "No reviews found"
                        });
                    }
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
    }
};


module.exports.reviewsUpdateOne = function (req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(
            function (err, location) {
                var thisReview;
                if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    logger.error('review update one error:', err);
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (location.reviews && location.reviews.length > 0) {
                    thisReview = location.reviews.id(req.params.reviewid);
                    if (!thisReview) {
                        sendJsonResponse(res, 404, {
                            "message": "reviewid not found"
                        });
                    } else {
                        thisReview.author = req.body.author;
                        thisReview.rating = req.body.rating;
                        thisReview.reviewText = req.body.reviewText;
                        location.save(function (err, location) {
                            if (err) {
                                logger.error('location save review update one error:', err);
                                sendJsonResponse(res, 404, err);
                            } else {
                                updateAverageRating(location._id);
                                sendJsonResponse(res, 200, thisReview);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No review to update"
                    });
                }
            }
        );
};

module.exports.reviewsDeleteOne = function (req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(
            function (err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    logger.error('review delete one error:', err);
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (location.reviews && location.reviews.length > 0) {
                    if (!location.reviews.id(req.params.reviewid)) {
                        sendJsonResponse(res, 404, {
                            "message": "reviewid not found"
                        });
                    } else {
                        location.reviews.id(req.params.reviewid).remove();
                        location.save(function (err) {
                            if (err) {
                                logger.error('location save in review delete one error:', err);
                                sendJsonResponse(res, 404, err);
                            } else {
                                updateAverageRating(location._id);
                                sendJsonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No review to delete"
                    });
                }
            }
        );
};
