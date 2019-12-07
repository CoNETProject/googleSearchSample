"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nightmare = require('nightmare');
const node_uuid_1 = require("node-uuid");
/**
 *
 *          Google search Results Element
 */
Nightmare.action('clearCache', (name, options, parent, win, renderer, done) => {
    parent.respondTo('clearCache', done => {
        win.webContents.session.clearCache(done);
    });
    done();
}, function (done) {
    this.child.call('clearCache', done);
});
/** */
Nightmare.action('waitUntilNetworkIdle', 
// The first callback defines the action on Electron's end,
// making some internal objects available.
function (name, options, parent, win, renderer, done) {
    // `parent` is Electron's reference to the object that
    // passes messages between Electron and Nightmare.
    parent.respondTo('waitUntilNetworkIdle', (waitTime, done) => {
        let lastRequestTime = Date.now();
        const startedTime = new Date();
        let MaxRunningTime = lastRequestTime + 1000 * 30;
        // win.webContents allows us to control the internal
        // Electron BrowserWindow instance.
        win.webContents.on('did-get-response-details', () => {
            lastRequestTime = Date.now();
        });
        const check = () => {
            const now = Date.now();
            const elapsedTime = now - lastRequestTime;
            console.log(`【waitUntilNetworkIdle CHECK now :${startedTime.toLocaleDateString()}】 elapsedTime [${elapsedTime}] >= waitTime [${elapsedTime >= waitTime}] now >  MaxRunningTime [${now > MaxRunningTime}]`);
            if (elapsedTime >= waitTime || now > MaxRunningTime) {
                done(); // Complete the action.
            }
            else {
                setTimeout(check, waitTime - elapsedTime);
            }
        };
        setTimeout(check, waitTime);
    });
    done(); // Complete the action's *creation*.
}, 
// The second callback runs on Nightmare's end and determines
// the action's interface.
function (waitTime, done) {
    // This is necessary because the action will only work if
    // action arguments are specified before `done`, and because
    // we wish to support calls without arguments.
    if (!done) {
        done = waitTime;
        waitTime = 500;
    }
    // `this.child` is Nightmare's reference to the object that
    // passes messages between Electron and Nightmare.
    this.child.call('waitUntilNetworkIdle', waitTime, done);
});
/** */
const firstWaitElement = '#searchform';
const typeInputElement = '#searchform [name=q]';
const googleSearchResultElement = '#main';
const googleSearchURL = 'https://www.google.com';
const openHtmlMaxsumTime = 1000 * 30;
exports.GoogleSearchNext = (link, __CallBack) => {
    require('nightmare-real-mouse')(Nightmare);
    const nightmare = Nightmare({
        switches: {
            'lang': 'en'
        },
        waitTimeout: 45 * 1000,
        executionTimeout: 2 * 60 * 1000,
        sandbox: true,
        partition: this.hashCode,
        enableRemoteModule: false,
        contextIsolation: true,
        titleBarStyle: 'hidden',
        //
        //show: false,
        frame: false,
        thickFrame: false,
        show: false,
    });
    nightmare
        .cookies.clear()
        .goto('https://www.google.com/preferences?hl=en-CA&fg=1')
        .waitUntilNetworkIdle(1000)
        .wait('#regionanchormore')
        .click(`#regionanchormore`)
        .wait('#regionoUS')
        .scrollTo(2000, 0)
        .realClick('#regionoUS')
        .realClick(`div[role="button"]`)
        .waitUntilNetworkIdle(1000)
        .wait(firstWaitElement)
        .goto(googleSearchURL + link)
        .waitUntilNetworkIdle(1000)
        //.wait ( googleSearchResultElement )
        //.html ('temp/googleSearchFirstSS2', 'HTMLComplete')
        .evaluate(googleSearchResultElement => {
        return document.querySelector(googleSearchResultElement).innerHTML;
    }, googleSearchResultElement)
        .end()
        //   得到Document
        .then(dd => {
        __CallBack(null, dd);
        //      wait page ACTION 
    })
        .catch(ex => {
        nightmare
            .screenshot('temp/GoogleSearch.googleSearchResultElementTimeOutERROR1.png')
            .end();
        __CallBack(ex);
    });
};
exports.openHtmlPage = (sideUrl, width = 800, height = 1200, uuid, __CallBack) => {
    let _callback = false;
    const fileName = `/temp/${uuid}`;
    const nightmare = Nightmare({
        waitTimeout: 60 * 1000,
        //
        switches: {
            'lang': 'en'
        },
        width: width,
        height: height * 2,
        center: true,
        resizable: false,
        executionTimeout: 2 * 60 * 1000,
        titleBarStyle: 'hidden',
        openDevTools: {
            mode: 'detach'
        },
        thickFrame: false,
        show: false,
        frame: false,
        movable: false,
        fullscreen: false,
        fullscreenable: false,
        skipTaskbar: false,
        kiosk: true,
        parent: null,
        autoHideMenuBar: true,
        transparent: false,
        paintWhenInitiallyHidden: false,
        /** */
        webPreferences: {
            devTools: false,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            preload: null,
            sandbox: false,
            webgl: false,
            plugins: false,
            experimentalFeatures: false,
            scrollBounce: false,
            contextIsolation: true,
            safeDialogs: true,
            affinity: uuid,
            session: node_uuid_1.v4(),
            partition: node_uuid_1.v4(),
            autoplayPolicy: 'document-user-activation-required',
            enableRemoteModule: false,
            allowRunningInsecureContent: true,
            offscreen: false,
            nativeWindowOpen: false,
            webviewTag: false,
            navigateOnDragDrop: false
            //javascript: false
        },
    });
    nightmare
        .goto(sideUrl)
        .waitUntilNetworkIdle(3000) ///^https:\/\/www.youtube.com\/watch/.test( sideUrl ) ? 4000 : 1000 )
        //.scrollTo( height, 0 )
        //.waitUntilNetworkIdle ( 2000 )
        .html(fileName + '.html', 'HTMLComplete')
        .screenshot(`${fileName}.png`)
        .end()
        .then(screenShot => {
        console.log(`\n\n--------------------------------------\nopenHtmlPage finished _callback =[${_callback}] success!\n\n--------------------------------------`);
        clearTimeout(timer);
        if (!_callback) {
            _callback = true;
            return __CallBack();
        }
    })
        .catch(err => {
        if (!_callback) {
            _callback = true;
            return __CallBack(err);
        }
    });
    const timer = setTimeout(() => {
        nightmare
            .html(fileName + '.html', 'HTMLComplete')
            .screenshot(`${fileName}.png`)
            .end()
            .then(() => {
            console.log(`\n\n--------------------------------------\nopenHtmlPage setTimeout! _callback =[${_callback}]\n\n--------------------------------------`);
            if (!_callback) {
                _callback = true;
                return __CallBack();
            }
        });
    }, openHtmlMaxsumTime);
};
exports.GoogleImageSearch = (imageFileName, __CallBack) => {
    const imageSearchUrl = 'https://www.google.ca/imghp?hl=en&tab=wi&authuser=0&ogbl';
    require('nightmare-real-mouse')(Nightmare);
    require('nightmare-upload')(Nightmare);
    const inputEle = '#qbfile';
    const SearchElm = '#search';
    const nightmare = Nightmare({
        switches: {
            'lang': 'en'
        },
        show: false,
        frame: false,
        sandbox: true,
        partition: this.hashCode,
        enableRemoteModule: false,
        contextIsolation: true,
        thickFrame: false,
        paintWhenInitiallyHidden: false,
        titleBarStyle: 'hidden',
        typeInterval: () => { return 1000 + 1000 * Math.random(); },
        //
        executionTimeout: 2 * 60 * 1000,
    });
    nightmare
        .cookies.clear()
        .goto('https://www.google.com/preferences?hl=en-CA&fg=1')
        .waitUntilNetworkIdle(1000)
        .wait('#regionanchormore')
        .click(`#regionanchormore`)
        .wait('#regionoUS')
        .scrollTo(2000, 0)
        .realClick('#regionoUS')
        .realClick(`div[role="button"]`)
        .waitUntilNetworkIdle(500)
        .wait(firstWaitElement)
        .goto(imageSearchUrl)
        .waitUntilNetworkIdle(500)
        .click("div[jscontroller='TJw5qb']")
        .wait(inputEle)
        .click(inputEle)
        //  等待第一個Element的出現
        //.type ( typeInputElement, searchWord )
        //.type ( typeInputElement, '\u000d')
        //  等待search結果出現
        .upload(inputEle, '/' + imageFileName)
        .wait(SearchElm)
        .waitUntilNetworkIdle(2000)
        //.inject('js', jqueryFile )
        //.then (() => {
        //console.log (`inject('js', jqueryFile  finished!`)
        //nightmare
        //.html ('temp/112233333', 'HTMLComplete')
        /** */
        .evaluate(googleSearchResultElement => {
        return document.querySelector(googleSearchResultElement).innerHTML;
    }, googleSearchResultElement)
        //.screenshot('temp/200000.png')
        .end()
        //   得到Document
        /** */
        .then(dd => {
        return __CallBack(null, dd);
        //      wait page ACTION 
    })
        //})
        //   catch 無預期結果
        .catch(ex => {
        nightmare
            .screenshot('temp/GoogleSearch.googleImageSearchResultERROR.png')
            .end();
        __CallBack(ex);
    });
};
exports.GoogleNewsSearch = (newsUrl, __CallBack) => {
    return exports.GoogleSearchNext(newsUrl, __CallBack);
};
exports.GoogleSearchFunV2 = (searchWord, __CallBack) => {
    const realMouse = require('nightmare-real-mouse')(Nightmare);
    const nightmare = Nightmare({
        switches: {
            'lang': 'en'
        },
        sandbox: true,
        partition: this.hashCode,
        enableRemoteModule: false,
        contextIsolation: true,
        paintWhenInitiallyHidden: false,
        frame: false,
        thickFrame: false,
        titleBarStyle: 'hidden',
        typeInterval: () => { return 1000 + 1000 * Math.random(); },
        //
        show: false,
        waitTimeout: 45 * 1000,
    });
    const lick = 'regionoUS';
    nightmare
        .cookies.clear()
        //.clearCache ()
        //.then ( () => {
        //this.nightmare
        .goto('https://www.google.com/preferences?hl=en-CA&fg=1')
        .waitUntilNetworkIdle(1000)
        .wait('#regionanchormore')
        .click(`#regionanchormore`)
        .wait('#regionoUS')
        .scrollTo(2000, 0)
        .realClick('#regionoUS')
        .realClick(`div[role="button"]`)
        .waitUntilNetworkIdle(1000)
        .wait(firstWaitElement)
        //  等待第一個Element的出現
        .type(typeInputElement, searchWord)
        .type(typeInputElement, '\u000d')
        //  等待search結果出現
        .wait(googleSearchResultElement)
        .waitUntilNetworkIdle(2000)
        //.inject('js', jqueryFile )
        //.then (() => {
        //console.log (`inject('js', jqueryFile  finished!`)
        //nightmare
        //.html ('temp/googleSearchFirstSS1', 'HTMLComplete')
        .evaluate(googleSearchResultElement => {
        return document.querySelector(googleSearchResultElement).innerHTML;
    }, googleSearchResultElement)
        .end()
        //   得到Document
        .then(dd => {
        return __CallBack(null, dd);
        //      wait page ACTION 
    }).catch(ex => {
        nightmare.html(`temp/googleSearchError${new Date().toISOString()}.mhtml`, 'MHTML');
    });
};
/*

openHtmlPage ('https://twitter.com/realdonaldtrump/media', 1024, 2100, 'df9f7dde-b9ed-4af6-bd01-73f7bb8b07df', err => {
    if ( err ) {
        return console.log ( err )
    }
    console.log (`success!`)
})

/*
const fileName = v4()
openHtmlPage('https://www.youtube.com/watch?v=3kRc8QxMQpk', 2120, 2800, fileName, err => {
    if ( err ) {
        return console.log (`openHtmlPage error`, err )
    }
    return console.log (`openHtmlPage success! ${ fileName }` )
})

/** 畫像click */
/*
GoogleNewsSearch ( '/search?q=trump&source=lnms&tbm=isch&sa=X&ved=2ahUKEwj7n7WNpIHmAhXmFTQIHV3jBpYQ_AUoA3oECBUQBQ', ( err, data ) => {
    if ( err ) {
        return console.log ( err )
    }
    Fs.writeFile ( 'temp/imageNext.html', data, err => {
        if ( err ) {
            return console.log ( err )
        }
        return console.log ('success!')
    })
})
/** */
/*

GoogleNewsSearch ( '/search?q=%E9%83%AD%E6%96%87%E8%B2%B4&tbm=nws&ei=71xpXZfuKs24-gSSu6roBA&start=10&sa=N&ved=0ahUKEwjXoeKyj6vkAhVNnJ4KHZKdCk0Q8NMDCGo', 'vgasvcdlbasc', ( err, data ) => {
    if ( err ) {
        return console.log ( err )
    }
    Fs.writeFile ( 'temp/newsSearchNext.html', data, err => {
        if ( err ) {
            return console.log ( err )
        }
        return console.log ('success!')
    })
})
/** */
/*
GoogleSearchNext ( "/search?q=%E9%83%AD%E6%96%87%E8%B2%B4&ei=m_F4XZaiCazE0PEPvI2NwAk&start=10&sa=N&ved=0ahUKEwjW2_ak68jkAhUsIjQIHbxGA5gQ8NMDCL0B",
    'asdcsadcdsac', ( err, data ) => {
        if ( err ) {
            return console.log ( err )
        }
        Fs.writeFile ('temp/imageNext1.html', data, err => {
            if ( err ) {
                return console.log ( err )
            }
            return console.log ('success!')
        })
})
/**

/** */
/*
GoogleSearchFunV2 ( '郭文貴', ( err, data ) => {
    if ( err ) {
        return console.log ( err )
    }
    Fs.writeFile ( 'temp/googleSearchFirst.html', data, err => {
        if ( err ) {

            return console.log ( err )
        }
        return console.log ('success!')
    })
})
/** */
/*

GoogleSearchNext ( "/search?q=%E9%83%AD%E6%96%87%E8%B2%B4&ei=6dBsXYriCIC_0PEPuZSQoAk&start=10&sa=N&ved=0ahUKEwjK-uW12rHkAhWAHzQIHTkKBJQQ8NMDCLMB",
    'asdcsadcdsac', ( err, data ) => {
        if ( err ) {
            return console.log ( err )
        }
        Fs.writeFile ('temp/googleSearchNext.html', data, err => {
            if ( err ) {
                return console.log ( err )
            }
            return console.log ('success!')
        })
})
/** *
GoogleImageSearch ( 'temp/c39e8022-3afe-47a0-bde2-083e2aa59614.png', ( err, data ) => {
    if ( err ) {
        return console.log ( err )
    }
    return Fs.writeFile ('temp/imageSearchtemp.html', data, err => {
        if ( err ) {
            return console.log ( err )
        }
        console.log ( `success!`)
    })
})
/** */
