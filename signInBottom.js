// ==UserScript==
// @name         SignInBottom
// @namespace    https://github.com/0BlueYan0
// @version      1.1
// @description  Generate a bottom link.
// @author       0BlueYan0
// @match        https://ilearn.fcu.edu.tw/course/view.php?id=*
// @grant        none
// @license      MIT
// @downloadURL  https://update.greasyfork.org/scripts/512116/SignInBottom.user.js
// @updateURL    https://update.greasyfork.org/scripts/512116/SignInBottom.meta.js
// ==/UserScript==

(function() {
    let headers = {
        "Accept": "*/*",
        "Accept-Language": 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
        "DNT": "1",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Content-Type":"application/json; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3573.0 Safari/537.36",
    }
    
    const className = document.querySelector('#page-header > div.d-sm-flex.align-items-center > div.mr-auto > div > div > h1');
    let code = className.textContent.split('[')[1].split(']')[0];
    let year_sms = className.textContent.split(' ')[0];
    
    let payload = {
        "baseOptions":{
            "lang":"cht",
            "year":year_sms.substring(0,3),
            "sms":year_sms.substring(3)
        },
        "typeOptions":{
            "code":{             // ��ҥN��
                "enabled":"true",
                "value":code
            },
            "weekPeriod":{
                "enabled":"false",
                "week":"*",      // �P�� */1/2/../7
                "period":"*"     // �`�� */0/1/2/../14
            },
            "course":{           // ��ئW��
                "enabled":"false",
                "value":""
            },
            "teacher":{          // �}�ұЮv�m�W
                "enabled":"false",
                "value":""
            },
            "useEnglish":{       // ���^�y�½�
                "enabled":"false"
            },
            "useLanguage":{      // �½һy��
                "enabled":"false",
                "value":"01"     // 01�G���� 02�G�^�y 03�G��y 04�G�w�y 05�G�k�y 06�G��Z���y 07�G��L 08�G���^
            },
            "specificSubject":{  // �S�w���
                "enabled":"false",
                "value":"1"      // 1�G�q�ѽҵ{ 2�G��|�ﶵ�ҵ{ 3�G�j�ǰ��
            },
            "courseDescription":{// �ҵ{�y�z
                "enabled":"false",
                "value":""
            }
        }
    }
    
    let url = 'https://cors-anywhere.herokuapp.com/https://coursesearch03.fcu.edu.tw/Service/Search.asmx/GetType2Result';
    var cls_id = "", total = 0, sub_id = "", scr_dup = "", sub_id3="";
    fetch(url,{
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    }).then(response => response.text()).then(data => {
        data.replace('\\"','"' );
        data.replace(':"{',': {' );
        data.replace('}]}"}','}]}}');
        const jsonData = JSON.parse(data);
    
        total = jsonData.total;
        cls_id = jsonData.items['0'].cls_id;
    
        if(total > 1){
            cls_id = cls_id.substring(0, cls_id.length - 1) + '9';
        }
    
        sub_id = jsonData.items[0].sub_id;
        scr_dup = jsonData.items['0'].scr_dup;
        sub_id3 = jsonData.items['0'].sub_id3;
    
        const signInLink = "https://ilearn.fcu.edu.tw/apps/apps_sso.php?course="+ year_sms + cls_id + sub_id + scr_dup + sub_id3 +"&log_app=03D&log_lang=tw&log_block=FCU%E8%AA%B2%E5%8B%99%E5%B7%A5%E5%85%B7&sys_name=%E9%BB%9E%E5%90%8D";
    
        const ul = document.querySelector('#inst36323 > div > div > ul');
    
        const li = document.createElement('li');
        li.classList.add('new-li');
    
        const c1 = document.createElement('div');
        c1.classList.add('new-column-c1');
        li.appendChild(c1);
    
        const a = document.createElement('a');
        a.target = '_blank';
        a.href = signInLink;
        c1.appendChild(a);
    
        const i = document.createElement('i');
        i.setAttribute('class', 'icon fa fa-map-marker fa-fw icon');
        i.setAttribute('aria-hidden', 'true');
        a.appendChild(i);
        a.innerHTML += '�I�W';
    
        const reference = document.querySelector('#inst36323 > div > div > ul > li:nth-child(6)');
    
        ul.insertBefore(li, reference);
    });
    
})();