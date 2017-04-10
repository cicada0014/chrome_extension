export class LoginUser {
    constructor(
        public name: string,
        public email: string) { }
}


// 테스트용 목객체 데이터
const LOGINUSERS = [
    new LoginUser('index',
    
     `
        <div > 
         <p>   보다 빠르고 , 간편하게 리서칭을 도와주는 도구 </p>
         <p>   간단한 문서를 만드는데 매우 효과적입니다! </p>
         <p>   언제, 어디에서나 이용할 수 있습니다! </p>

        <div>
    
    `),
    new LoginUser('kim', 'kim@editor.com'),
    new LoginUser('lee', 'lee@editor.com'),
    new LoginUser('park', 'park@editor.com'),
    new LoginUser('Kadler Kim', 'cicada0014@gmail.com'),
    new LoginUser('소리탬', 'taemin3000@gmail.com'),
    new LoginUser('김태민', 'forest0121@gmail.com')
]

export let userPromise = Promise.resolve(LOGINUSERS);

import { Injectable } from '@angular/core';

@Injectable()
export class LoginUserService {

    constructor() { }
    findByName(name: string): Promise<LoginUser> {
        return userPromise.then(users => { return users.find(user => user.name === name) });
    }

}