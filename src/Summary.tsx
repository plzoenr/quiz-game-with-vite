import React from 'react';
import {Link} from 'react-router-dom';

interface LeaderBoard {
    userName: string;
    score: number;
}

const Summary: React.FC = () => {
    const scoreString: string | null = localStorage.getItem("quiz_score");
    const score: number | 0 = scoreString ? parseInt(scoreString) : 0;
    const mockUpLeaderBoard: LeaderBoard[] = [{
        userName: "Alex Sis",
        score: 17
    }, {
        userName: "JaneGen",
        score: 15
    }, {
        userName: "NoMore",
        score: 10
    }, {
        userName: "Ps.GG",
        score: 8
    }, {
        userName: "YOU",
        score: score
    }]
    const leaderBoardSorted = mockUpLeaderBoard.sort((a, b) => a.score > b.score ? -1 : 1)


    return (
        score ? (
            <div className="p-4">
                <div className="text-body">
                    <h2>Summary</h2>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>UserName</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaderBoardSorted.map((personalScore, index) => (
                            <tr key={index}>
                                <td className={personalScore.userName === "YOU" ? 'text-bg-primary' : ''}>{index + 1}</td>
                                <td className={personalScore.userName === "YOU" ? 'text-bg-primary' : ''}>{personalScore.userName}</td>
                                <td className={personalScore.userName === "YOU" ? 'text-bg-primary' : ''}>{personalScore.score}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center">
                    <Link to="/" className="btn btn-primary">Play Again</Link>
                </div>
            </div>
        ) : (
            <div>You have no Score. Play first <Link to="/">Play Quiz</Link></div>
        )
    );
}

export default Summary;
