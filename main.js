const axios = require('axios')
const EventSource = require('eventsource')
require('dotenv').config();

let fiveInARow = [[]];
let isPlayed;

const generateCords = () => {
    try{
        let x = Math.floor(Math.random() * 56)-28;
        let y = Math.floor(Math.random() * 40)-19;

        return {
            x: x,
            y: y
        };
    }catch(err){
        console.error(err);
    }
}

let user = {
    Id: process.env.USER_ID,
    Token: process.env.USER_TOKEN,
}


const createUser = () => {
    return new Promise((resolve, reject) => {
        axios.post('https://piskvorky.jobs.cz/api/v1/user', {
            nickname: process.env.NICKNAME,
            email: process.env.EMAIL
        }).then(response => {
            resolve(response.data);
        }).catch(reject);
    })
}

const connectUser = () => {
    return new Promise((resolve, reject) => {
        axios.post('https://piskvorky.jobs.cz/api/v1/connect', {
            userToken: user.Token
        }).then(response => {
            console.log(response.data);
            resolve(response.data);
        }).catch(reject);
    })
}

const playGame = (data) => {
    return new Promise((resolve, reject) => {
        let cords = generateCords();

        axios.post('https://piskvorky.jobs.cz/api/v1/play', {
            userToken: user.Token,
            gameToken: data.gameToken,
            positionX: cords.x,
            positionY: cords.y
        }).then(response => {
            console.log(response.data);
            resolve(response.data);
        }).catch(reject);
    })
}

const checkLastStatus = (data) => {
    return new Promise((resolve, reject) => {
        axios.post('https://piskvorky.jobs.cz/api/v1/checkLastStatus', {
            userToken: user.Token,
            gameToken: data.gameToken,
        }).then(response => {
            console.log(response.data);
            resolve(response.data);
        }).catch(reject);
    })
}

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}



const main = async () => {
    try{
        const connectData = await connectUser();

        while(1){
            isPlayed = await checkLastStatus(connectData);
            await sleep(2000);

            if(isPlayed.actualPlayerId == user.Id) 
                console.log("Na řadě jsem já.");
            else 
                console.log("Na řadě je spoluhráč.");



            if(JSON.stringify(isPlayed.coordinates) != "[]")
                console.log(`Zahrál na šouřadnice X: ${isPlayed.coordinates[0].x} Y: ${isPlayed.coordinates[0].y} `)
            else
                console.log(isPlayed);



            if(isPlayed.actualPlayerId == user.Id){ 
                await sleep(1000);

                await playGame(connectData);
            }

            await sleep(1000);

            

        }
        
    }catch(err){
        console.log(err);
    }
}

main();

//createUser();


