import React from "react";

const topics = [
  "Politics",
  "Technology",
  "Sports",
  "Health",
  "Education",
  "Entertainment",
];

const TopicFilter = ({ selectedTopic, setSelectedTopic }) => {
  return (
    <div className="topic-filter">
      {topics.map((topic) => (
        <button
          key={topic}
          className={`topic-button ${selectedTopic === topic ? "active" : ""}`}
          onClick={() => setSelectedTopic(topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicFilter;
