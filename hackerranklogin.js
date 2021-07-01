const puppeteer = require("puppeteer");
const id = "xohej77478@paseacuba.com";
const pass = "123456789";
let tab;
let gcode;
let idx;
let browserpromise = puppeteer.launch(
    {
        headless:false,
        defaultViewport:null,
        args:["--start-maximized"]
    });
    console.log(browserpromise);
    browserpromise.then(function(browser){
    console.log("browser Open");
    return browser.pages();
})
.then(function(pages){
    tab = pages[0];
    return tab.goto("https://www.hackerrank.com/auth/login");
})
.then(function(){
    return tab.type("#input-1", id);
})
.then(function(){
    return tab.type("#input-2", pass);
})
.then(function(){
    return tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
})
.then(function(){
    return waitandclick("#base-card-1-link");
})
.then(function(){
    return waitandclick('a[data-attr1="warmup"]');
})
.then(function(){
    let waitPromise = tab.waitForSelector('.js-track-click.challenge-list-item',{visible:true});
    return waitPromise;
})
.then(function(){
    let allquestionPromise = tab.$$('.js-track-click.challenge-list-item');
    return allquestionPromise;
})
.then(function(allquestionTag){
    let allLinkPromises = [];
    for(let i=0;i<allquestionTag.length;i++)
    {
        let aTag = allquestionTag[i];
        let linkPromise = tab.evaluate(function(elem){
            return elem.getAttribute("href");
        }, aTag);
        allLinkPromises.push(linkPromise);
    }
    let allPromise = Promise.all(allLinkPromises);
    return allPromise;
})
.then(function(allPromiselink){
    let completeLink = allPromiselink.map(function(link){
        return "https://www.hackerrank.com" +link;
    })
    // console.log(completeLink);
    // return completeLink;
    let oneQuestionSolvePromise = solveQuesiton(completeLink[0]);
    return oneQuestionSolvePromise;
})

.catch(function(error){
    console.log(error);
})

function waitandclick(selector){
    return new Promise(function(resolve,reject){
        let waitPromise = tab.waitForSelector(selector, {visible:true});
        waitPromise.then(function(){
            return tab.click(selector);
        })
        .then(function(){
            resolve();
        })
        .catch(function(){
            reject();
        })
    });
}

function getcode(){
    return new Promise(function(resolve, reject){
        let waitPromise = tab.waitForSelector(".hackdown-content h3");
        waitPromise
        .then(function(){
            let allcodeLanguagePromise = tab.$$(".hackdown-content h3");
            return allcodeLanguagePromise;
        })
        .then(function(AllcodeLanguage){
            let alllanguageArray =[];
            for(let i=0;i<AllcodeLanguage.length;i++)
            {
                let codeNamePromise = tab.evaluate(function(elem){
                    return elem.textContent;
                }, AllcodeLanguage[i]);
                alllanguageArray.push(codeNamePromise);
            }
            let allcodePomise = Promise.all(alllanguageArray);
            return allcodePomise;
        })
        .then(function(allcode){
            for(let i=0;i<allcode.length;i++)
            {
                if(allcode[i] == "C++"){
                    idx = i;
                    break;
                }
            }
            let codeDivPromise = tab.$$(".hackdown-content .highlight")
            return codeDivPromise;
        })
        .then(function(DIVPromise){
            let codeDiv = DIVPromise[idx];
            let codesPromise = tab.evaluate(function(elem){
                return elem.textContent;
            }, codeDiv);
            return codesPromise;
        })
        // .then(function(code){
        //     console.log(code);
        // })
        .then(function(code){
            gcode = code;
            resolve();
        })
        .catch(function(error){
            reject(error);
        })
    });
}

function Pastecode(){
    return new Promise(function(resolve, reject){
        let returntoProblem = tab.click('div[data-attr2="Problem"]');
        returntoProblem
        .then(function(){
            let checkboxPromise = waitandclick(".checkbox-input");
            return checkboxPromise;
        })
        .then(function(){
            let testboxPromise = tab.waitForSelector('#input-1');
            return testboxPromise;
        })
        .then(function(){
            let copyCodePromise = tab.type('#input-1', gcode);
            return copyCodePromise;
        })
        .then(function(){
            let CtrlDownPromise = tab.keyboard.down("Control");
            return CtrlDownPromise;
        })
        .then(function(){
            let AkeyPromise = tab.keyboard.down("A");
            return AkeyPromise;
        })
        .then(function(){
            let XkeyPromise = tab.keyboard.press("X");
            return XkeyPromise;
        })
        .then(function(){
            let CodeBoxPromise = tab.click('.monaco-editor.no-user-select.vs');
            return CodeBoxPromise;
        })
        .then(function(){
            let AkeyPromise = tab.keyboard.down("A");
            return AkeyPromise;
        })
        .then(function(){
            let VkeyPromise = tab.keyboard.down("V");
            return VkeyPromise;
        })
        .then(function(){
            let CtrlUpPromise = tab.keyboard.down("Control");
            return CtrlUpPromise;
        })
        .then(function(){
            resolve();
        })
        .catch(function(error){
            reject(error);
        })
    })
}
  
function solveQuesiton(Qlink)
{
    return new Promise(function(resolve, reject){
        let gotoPromise = tab.goto(Qlink);
        gotoPromise
        .then(function(){
            console.log("Question Achieved");
            let waitAndClickPromise = waitandclick('div[data-attr2="Editorial"]');
            return waitAndClickPromise;
        })
        .then(function(){
            let codeNamePromise = getcode();
            return codeNamePromise;
        })
        .then(function(){
            let pastePromise = Pastecode();
            return pastePromise;
        })
        .then(function(){
            let RunProgram = tab.click('#content > div > div > div > div > div.community-content > div > section > div > div > div > div.full-screen-split.split-wrap.left-pane > section.code-editor-section.split > div:nth-child(1) > div > div.hr-monaco-editor-wrapper > div > div:nth-child(1) > div.pmR.pmL.pmB.plT.run-code-wrapper > button.ui-btn.ui-btn-normal.ui-btn-secondary.pull-right.msR.hr-monaco-compile.hr-monaco__run-code.ui-btn-styled');
            return RunProgram;
        })
        .then(function(){
            resolve();
        })
        .catch(function(error){
            reject(error)
        })
    })
}


