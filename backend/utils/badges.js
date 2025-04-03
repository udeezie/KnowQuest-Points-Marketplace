function checkAndAwardBadges(user) {
    const badgeMilestones = [
      { type: "Bronze Badge", points: 50, reward: 25 },
      { type: "Silver Badge", points: 250, reward: 50 },
      { type: "Gold Badge", points: 500, reward: 100 },
      { type: "Platinum Badge", points: 1250, reward: 250 },
      { type: "Diamond Badge", points: 2500, reward: 500 },
      { type: "S-Tier Badge", points: 5000, reward: 1000 },
    ];
  
    const newBadges = [];
  
    for (const milestone of badgeMilestones) {
      if (
        user.points >= milestone.points &&
        !user.badges.includes(milestone.type)
      ) {
        user.badges.push(milestone.type);
        user.points += milestone.reward;
  
        user.pointHistory.push({
          type: "Badge Earned",
          category: milestone.type,
          pointsAwarded: milestone.reward,
          date: new Date(),
        });
  
        newBadges.push(milestone.type);
      }
    }
  
    return newBadges;
  }
  
  module.exports = { checkAndAwardBadges };
  