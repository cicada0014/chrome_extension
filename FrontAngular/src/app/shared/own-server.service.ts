import { Injectable } from '@angular/core';

@Injectable()
export class OwnServerService {

    private SERVER_URL: string = 'https://threendeditor-own.herokuapp.com/userInfo/'
    // private SERVER_URL = "http://localhost:3000/userInfo/"
    constructor() {
        // this.URLSELECT(1);
    }

    private URLSELECT(DEV) {
        if (DEV) {
            this.SERVER_URL = "http://localhost:3000";
        } else {

        }
    }

    getUserData(userId: string) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.SERVER_URL + userId, true);
            xhr.onload = (result: any) => {
                // console.log(result.currentTarget.response);

                if (result.currentTarget.response.nothing) {
                    // 유저 데이터가 존재하지않으면 프로미스를 거절한다. 
                    console.log(result.currentTarget.response.nothing);
                    reject();
                } else {
                    resolve(result.currentTarget.response);
                }
            }
            xhr.send();
        });
    }


    postUserInfo(userInfo: Object) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', this.SERVER_URL, true);
            // xhr.setRequestHeader("Access-Control-Allow-Origin","http://localhost:4200")
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = (result) => {
                console.log(result);
            };
            // 포스트로 보낼때는 키 밸류 형식으로 보내주어야 한다!! 아니면 서버에서 읽지를 못함.
            xhr.send("userInfo="+userInfo);
        })
    }



}