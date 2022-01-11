function checkIsGroup(from) {

    const splitFrom = from.split('@');

    return splitFrom[1] === "g.us"
}

function checkIsMe(from) {
    const splitFrom = from.split('@');
    return splitFrom[0] === "5565984432583"
}

module.exports = {checkIsGroup, checkIsMe}

