import { Router } from '@angular/router';
import { EventEmitter, Injectable, Output } from '@angular/core';

declare var chrome: any;

@Injectable()
export class ChromeExtensionService {
    private currentFileId: string;
    private currentFileName: string = "이름없는 문서";
    public fileAthor: string;
    public savedState: string = "저장이 필요해요";
    public writeTime: string; // 시간 객체로 확인해봐야겠어. 

    public isDriveWindowOpen: boolean = false;

    constructor(private router: Router) {

    }


    public getBookMarkList() {
        //https://developer.chrome.com/extensions/bookmarks#method-getTree
        // 관련 api 주소
        // 북마크는 트리구조로 되어있다. 
        // 전체 북마크의 아이디는 0 이다. 이것이 최상위 루트노드이다.
        // 생긴 순서대로 인덱스를 갖게된다. 아이디와 인덱스는 별개이다. 
        // 인덱스는 통상 쓰이는 것처럼 0부터 시작. 아이디는 생성된 순서대로 부여되는듯 하다. 
        // 북마크바의 첫번재 디렉토리에 있는 북마크들을 대상으로 한다. 아이디는 1번
        // 폴더화가 안되어있으므로 일단 다 가져와서 넣어본다. 
        return new Promise<any>(function (resolve, result) {
            chrome.bookmarks.getSubTree("0",(bmArr) => {
                //bookmark array 의 0 번째 객체는 최상단 노드, 
                // 그 자식객체들은 기존북마크와 기타북마크
                // 기존북마크가 0 번 인덱스. 그 자식객체들이 각 북마크 
                resolve(bmArr[0].children[0].children);
            })
        });
    }



    // 일반 호스트로 페이지를 열면 다른 곳의 내용을 불러올수가 없다. 자바스크립트로 요청하는 것이기때문...
    // 크롬 익스텐션에서만 CORS 정책에서 자유로울 수 있다.. 이는 연구해야할 필요성이 있다. 왜 익스텐션에서는 
    // 일반적인요청이 잘 들어오는 것일가. 크롬브라우저가 감싸고 있기때문이 아닐까 싶다.
    public pageGet(linkUrl: string) {


        return new Promise<string>(function (resolve, reject) {
            let xhr = new XMLHttpRequest();


            xhr.open('GET', linkUrl, true);
            xhr.onload = (result: any) => {
                //   this.iframeHtml.nativeElement.contentWindow.document.write(result.currentTarget.response)
                //   console.log(this.iframeHtml.nativeElement.contentWindow.document);
                //   this.iframeHtml.nativeElement.contentWindow.document.open()
                //   console.log($('body',this.iframeHtml.nativeElement.contentWindow.document));
                resolve(result.currentTarget.response);
                //   this.iframeHtml.nativeElement.contentWindow.document.close()

            }
            xhr.send();


        })

    }

    public getCurrentFileId() {
        return this.currentFileId;
    }

    public getCurrentFileName() {
        return this.currentFileName;
    }

    public getSavedState() {
        return this.savedState;
    }

    public interactiveGetToken() {
        let that = this;
        return new Promise<boolean>(function (resolve, reject) {
            try {
                // 크롬 자체 기능으로 토큰을 성공적으로 가져오면 두번째 매개변수 콜백함수를 실행한다.
                chrome.identity.getAuthToken({ interactive: true }, function (token) {
                    that.router.navigate(['3ndEditor'])
                        .then((result) => {
                            resolve(result);
                        })
                        .catch(() => {
                            resolve(false);
                        });
                });
            } catch (e) {
                console.log(e + "토큰을 구하지 못했어요! 토큰을 구하십쇼 토큰이 없으면 시행조차도 안되기때문");
                // 실패했음을 알림
                reject(e);
            }

        })
    }


    // 코드 설명
    // xhrWithAuth 메소드는 XMLHttpRequest 객체를 생성하고 외부 api 이용하도록 하는 메소드이다. 
    // 첫번째 매개변수로 request method를 , 두번째로 url 을 , 세번째로 사용자 인터페이스 유무를 , 네번째로 request 과정이 끝나고 나서 실행할 콜백함수를
    // 다섯번째로 필요한 추가 매개변수들을 넣어준다. 
    // 이 함수를 실행하게되면 가장먼저 토큰을 얻고, 토큰을 얻고난후에 XMLHttpRequest 객체를 만들어서 날린다. 
    // 객체를 날리기전에 파라미터를 url 에 자동으로 붙이는 formatParams 함수를 거친다
    // 

    private xhrWithAuth(method: string, url: string, callback, params, requestBody, requestHeader) {
        let access_token;
        let retry = true;
        let that = this;
        noInteractivegetToken();


        // 토큰을 얻는 과정이다. 이 과정은 토큰이 없는 경우 자동적으로 실패를 리턴하게 된다.
        // 초기 프로그램 실행시, 사용자 경험 향상을 위해서 interactive 값을 false로 해두었다.
        // false 값을 갖게되면, 사용자에게 토큰정보를 구할 인터페이스창이 뜨지 않고 에러도 나지않고 그대로 프로그램이 멈추기때문에,
        // try catch 문으로 강제로 에러를 잡아내 프로그램이 실행되도록 하였다.
        // catch 부분을 보면 에러가났을 경우 토큰을 얻을 수 있는 사용자 페이지로 라우팅 되게 해두었다. 
        function noInteractivegetToken() {
            try {
                chrome.identity.getAuthToken({ interactive: false }, function (token) {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError);
                        console.log("토큰을 구하는 과정에서의 에러입니다.");
                        callback(chrome.runtime.lastError);
                        return;
                    }
                    access_token = token;
                    requestStart();
                });

            } catch (e) {
                console.log(e + "토큰을 구하지 못했어요!? 토큰을 구하십쇼 토큰이 없으면 시행조차도 안되기때문");
                callback(chrome.runtime.lastError);

            }
        }





        function formatParams(params) {
            return "?" + Object
                .keys(params)
                .map(function (key) {
                    return key + "=" + params[key]
                })
                .join("&");
        }

        function requestStart() {
            var xhr = new XMLHttpRequest();
            console.log(url + formatParams(params));
            xhr.open(method, url + formatParams(params), true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
            if (requestHeader) {
                Object
                    .keys(requestHeader)
                    .forEach(header => {
                        xhr.setRequestHeader(header, requestHeader[header]);
                    })

            }
            xhr.onload = function requestComplete() {
                if (xhr.status == 401 && retry) {
                    console.log("리퀘스트 결과에 따른 401 에러입니다.");
                    retry = false;
                    chrome.identity.removeCachedAuthToken({ token: access_token },
                        noInteractivegetToken);
                } else {
                    callback(null, xhr.status, xhr.response);
                }
            }
            if (requestBody) {
                xhr.send(requestBody);
            } else {
                xhr.send();

            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // 이 함수에 대한 설명
    // checkGetToken 함수는 loginGuard 에 사용된다. 
    // 이 함수는 처음 프로그램을 실행시켰을때 바로 실행이 되며, 해당 사용자의 토큰이 있는지를 확인하고, 토큰이 있다면
    // 해당 사용자의 토큰을 토대로 자체 서버로 보내 추가 정보를 가져온다
    // 만약 토큰을 얻지 못했다면 토큰을 얻을 수 있는 화면으로 보내주게  된다. 
    public checkGetToken(): Promise<any> {
        let result;
        let params = {
            // corpus : "",
            // orderBy: "createdTime", // 만들어진 순서 
            // pageSize : "",
            // pageToken : "",
            // q : "",
            // spaces : "",
        };
        let method: string = 'GET';
        let url: string = 'https://www.googleapis.com/plus/v1/people/me';
        let that = this;
        let STATE_START = 1;
        let STATE_ACQUIRING_AUTHTOKEN = 2;
        let STATE_AUTHTOKEN_ACQUIRED = 3;

        let state = STATE_START;

        // let signin_button = document.querySelector('#signin');
        let signout_button = document.querySelector('#signOut');
        let user_info_div = document.querySelector('#user_info');



        return new Promise<any>(function (resolve, reject) {
            // signin_button.addEventListener('click', interactiveSignIn);
            signout_button.addEventListener('click', revokeToken);

            // 실질적으로 리퀘스트를 보내는 시점이다. 
            that.xhrWithAuth(method, url, onsuccess, params, null, null);

            // 리퀘스트를 보내고나서 성공적으로 통신이 되면 해당 객체를 수행하고, Promise에 대한 객체를 resolve한다.
            // 만약 통신이 실패했다면 reject를 수행한다. 
            function onsuccess(error, status, response) {
                if (!error && status == 200) {
                    changeState(STATE_AUTHTOKEN_ACQUIRED);
                    var user_info = JSON.parse(response);
                    resolve(user_info);
                    that.fileAthor = user_info.displayName;
                    populateUserInfo(user_info);
                } else {
                    reject(false);
                    that.router.navigate(['welcome']);
                    user_info_div.innerHTML = "시작하기 버튼을 눌러주세요.";
                    changeState(STATE_START);
                }
            }

            // 로그인에 대한 부가적인 함수 부분

            function disableButton(button) {
                button.classList.add('disabled', 'disabled');
            }

            function enableButton(button) {
                button.classList.remove('disabled');
            }

            function changeState(newState) {
                state = newState;
                // console.log(signin_button + "///"+signout_button)
                switch (state) {
                    case STATE_START:
                        // enableButton(signin_button);
                        disableButton(signout_button);
                        // disableButton(revoke_button);
                        break;
                    case STATE_ACQUIRING_AUTHTOKEN:
                        // disableButton(signin_button);
                        disableButton(signout_button);
                        // disableButton(revoke_button);
                        break;
                    case STATE_AUTHTOKEN_ACQUIRED:
                        // disableButton(signin_button);
                        enableButton(signout_button);
                        // enableButton(revoke_button);
                        break;
                }
            }
            function populateUserInfo(user_info) {
                user_info_div.innerHTML = "Hello! " + user_info.displayName + "";

                fetchImageBytes(user_info);
            }

            function fetchImageBytes(user_info) {
                if (!user_info || !user_info.image || !user_info.image.url) return;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', user_info.image.url, true);
                xhr.responseType = 'blob';
                xhr.onload = onImageFetched;
                xhr.send();
            }

            function onImageFetched(e) {
                if (this.status != 200) return;
                var imgElem = document.createElement('img');
                var objUrl = window.URL.createObjectURL(this.response);
                imgElem.src = objUrl;
                imgElem.onload = function () {
                    window.URL.revokeObjectURL(objUrl);
                }
                user_info_div.insertAdjacentElement("afterbegin", imgElem);
            }
            function interactiveSignIn() {
                changeState(STATE_ACQUIRING_AUTHTOKEN);

                // chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
                //     if (chrome.runtime.lastError) {
                //         // user_info_div.innerHTML = "" + chrome.runtime.lastError;
                //         changeState(STATE_START);
                //     } else {
                //         // user_info_div.innerHTML = 'Token acquired:' + token +
                //         //     '. See chrome://identity-internals for details.';
                //         changeState(STATE_AUTHTOKEN_ACQUIRED);
                that.xhrWithAuth(method, url, onsuccess, params, null, null);
                //     }
                // });
            }
            function revokeToken() {
                // user_info_div.innerHTML = "";
                chrome.identity.getAuthToken({ 'interactive': false },
                    function (current_token) {
                        if (!chrome.runtime.lastError) {

                            // @corecode_begin removeAndRevokeAuthToken
                            // @corecode_begin removeCachedAuthToken
                            // Remove the local cached token
                            chrome.identity.removeCachedAuthToken({ token: current_token },
                                function () { });
                            // @corecode_end removeCachedAuthToken

                            // Make a request to revoke token in the server
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
                                current_token);
                            xhr.send();
                            // @corecode_end removeAndRevokeAuthToken

                            // Update the user interface accordingly
                            changeState(STATE_START);
                            that.router.navigate(['welcome']);
                            user_info_div.innerHTML = ('사용권한을 허락해주세요');
                        }
                    });
            }
        })
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // 이 함수에 대한 설명
    // 이 함수는 구글 드라이브로부터  파일 리스트를 얻는 요청을 보낸다

    public getFileList(): Promise<Array<Object>> {
        let result;
        let params = {
            // corpus : "",
            orderBy: "createdDate desc", // 만들어진순서 역순서(최신의)
            // pageSize : "",
            // pageToken : "",
            q: "mimeType = 'text/plain' or mimeType = 'text/html'",
            // spaces : "",
        };
        let method: string = 'GET';
        let url: string = 'https://www.googleapis.com/drive/v2/files';
        let that = this;
        // 여기 스코프에 대해 한번 정리하고 가야겠다. 
        // 이 메소드를 호출한 곳은 프로미스 객체를 받는다. 프로미스는 매개변수로 들어간 함수를 실행한다.
        // 함수 실행중 resolve 함수에 들어간 값을 그다음 then 함수의 결과값으로 받아볼수가 있다.
        // new 연산자로 객체를 생성하게 되면 함수의 this를 그 생성자 이름의 객체로 묶어버린다. 
        // 즉, 호출된 시점이 아닌, 강제로 지정해버리는 것이다. 
        // 매개변수역시 그 함수의 변수이다. 프로미스의 매개변수로 들어간 콜백함수의 this는 프로미스이다.
        // 프로미스 생성자의 this는 자기자신이지만, 구성환경은 자신이 포함된 getFileList함수이다.
        return new Promise<Object>(function (resolve, reject) {

            // 실질적인 요청보내기 작업
            that.xhrWithAuth(method, url, onsuccess, params, null, null);

            // 성공했을때 하는 작업. 실해하게되면 
            function onsuccess(error, status, response) {
                if (!error && status == 200) {
                    let fileList = JSON.parse(response);
                    result = fileList['items'];
                    resolve(result);
                } else {
                    console.log("Get FileList fail!!!" + error);
                }

            }


        })


    }
    ////////////////////////////////////////////////////////////////////////////////////////
    public getFileContent(file) {
        let params = {
            alt: "media"
        }
        let method: string = 'GET';
        let url: string = 'https://www.googleapis.com/drive/v2/files/' + file.id;
        let that = this;

        return new Promise<Object>(function (resolve, reject) {

            // 실질적인 요청보내기 작업
            that.xhrWithAuth(method, url, onsuccess, params, null, null);

            // 성공했을때 하는 작업. 실해하게되면 
            function onsuccess(error, status, response) {
                if (!error && status == 200) {
                    let fileContent = response;
                    that.currentFileId = file.id;
                    that.currentFileName = file.title;
                    console.log(fileContent);

                    resolve(fileContent);
                } else {
                    console.log("Get FileContent fail!!!" + error);
                }
            }
        })

    }



    ////////////////////////////////////////////////////////////////////////////////////////
    // Jsonp 모듈은 get 방식만 가능하다. 
    public createFileWithMetaData(requestBody) {
        let params = {

        };
        let method: string = 'POST';
        let url: string = 'https://www.googleapis.com/drive/v3/files';
        let that = this;
        let requestHeader = {
            "Content-Type": "application/json ; charset=UTF-8"
        }
        return new Promise<any>(function (resolve, reject) {

            // 실질적인 요청보내기 작업
            // 메타데이터는 스트링 화 시켜서 보내야함.
            that.xhrWithAuth(method, url, onsuccess, params, JSON.stringify(requestBody), requestHeader);

            // 성공했을때 하는 작업. 실해하게되면 
            function onsuccess(error, status, response) {
                if (!error && status == 200) {
                    let createdFileMetaData = JSON.parse(response);
                    that.currentFileId = createdFileMetaData.id;
                    that.currentFileName = createdFileMetaData.name;
                    resolve(createdFileMetaData);
                } else {
                    console.log("Get FileList fail!!!" + error);
                    reject(error);
                }
            }


        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////

    public saveContent(fileId, requestBody) {

        let params = {
            uploadType: "media",
        }
        let method: string = 'PATCH';
        let url: string = 'https://www.googleapis.com/upload/drive/v3/files/' + fileId;
        let that = this;

        return new Promise<Object>(function (resolve, reject) {

            // 실질적인 요청보내기 작업

            that.savedState = "저장 중..."
            that.xhrWithAuth(method, url, onsuccess, params, requestBody, null);

            // 성공했을때 하는 작업. 실해하게되면 
            function onsuccess(error, status, response) {
                if (!error && status == 200) {
                    let fileContent = response;
                    that.savedState = "저장 됨";
                    resolve();
                } else {
                    console.log("Get FileContent fail!!!" + error);
                    reject(error)
                }
            }


        })

    }

}