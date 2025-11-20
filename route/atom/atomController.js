const db = require('../../db/db.js');

exports.makeAtom = (req, res) => {
    const { redCount, whiteCount, electronCount } = req.body;

    if (!req.session || !req.session.user || !req.session.user.username) {
        return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }
    const username = req.session.user.username;

    // 1. (가장 중요) 'atom' 테이블에서 양성자, 중성자, 전자가 모두 일치하는 동위원소를 찾습니다.
    db.query('SELECT * FROM atom WHERE proton = ? AND netron = ? AND electron = ?',
        [redCount, whiteCount, electronCount],
        (errAtom, resAtom) => {

            if (errAtom) {
                console.log(errAtom);
                return res.status(500).json({ success: false, message: 'DB 오류 (atom 조회)' });
            }

            // 2. (핵심 로직) 일치하는 원소가 없으면, 모달을 띄우지 않도록 'false' 응답
            if (resAtom.length === 0) {
                // 클라이언트는 이 메시지를 받아 alert()로 띄울 것입니다.
                return res.json({ success: false, message: '입력한 값과 일치하는 원소(동위원소)가 없습니다.' });
            }

            // 3. (성공) 일치하는 원소(동위원소)를 찾았습니다.
            const foundAtom = resAtom[0];
            const aid = foundAtom.number; // 히스토리 저장을 위한 isotope number
            const protonId = foundAtom.proton; // description 조회를 위한 양성자 수 (redCount와 동일)

            // 모달에 보낼 정보를 담을 객체
            let elementInfo = {
                symbol: foundAtom.symbol,     // atom 테이블에서 가져온 기호
                name_en: foundAtom.name       // atom 테이블에서 가져온 영문명
            };

            // 4. 'description' 테이블에서 한글명과 설명 조회
            db.query('SELECT name_ko, description FROM description WHERE id = ?', [protonId], (errDesc, resDesc) => {
                if (errDesc) {
                    console.log(errDesc);
                    return res.status(500).json({ success: false, message: 'DB 오류 (description 조회)' });
                }
                if (resDesc.length === 0) {
                    // atom에는 있지만 description에 없는 경우 (데이터 불일치)
                    return res.status(404).json({ success: false, message: '원소 설명 데이터를 찾을 수 없습니다.' });
                }

                // elementInfo 객체에 한글명과 설명 추가
                elementInfo.name_ko = resDesc[0].name_ko;
                elementInfo.description = resDesc[0].description;

                // 5. 사용자 ID 조회 (히스토리 저장을 위해)
                db.query('select id from users where username=?', [username], (errUser, resUser) => {
                    if (errUser || resUser.length === 0) {
                        // 사용자 조회에 실패해도 모달은 띄워야 하므로, 히스토리 저장만 실패 처리
                        console.log(errUser || '사용자 ID 조회 실패');
                        return res.json({
                            success: true,
                            historySaved: false,
                            message: '사용자 ID를 찾을 수 없어 히스토리 저장 안됨',
                            element: elementInfo,
                            counts: { red: redCount, white: whiteCount, electron: electronCount }
                        });
                    }

                    const uid = resUser[0].id;

                    // 6. 'history' 테이블에 삽입
                    db.query('insert into history(isotope_number,user_id) values (?,?)', [aid, uid], (errHistory, resHistory) => {
                        let historySaved = false;
                        let historyMessage = '';

                        if (errHistory) {
                            console.log(errHistory);
                            historyMessage = '히스토리 저장 실패';
                        } else {
                            console.log("History save success");
                            historyMessage = '히스토리 저장 성공';
                            historySaved = true;
                        }

                        // 7. 모든 정보 취합하여 최종 성공 응답 (모달 띄우기)
                        res.json({
                            success: true,
                            historySaved: historySaved,
                            message: historyMessage,
                            element: elementInfo, // 최종 조합된 원소 정보
                            counts: { red: redCount, white: whiteCount, electron: electronCount }
                        });
                    }); // end history insert
                }); // end user query
            }); // end description query
        }); // end atom query
};
exports.getAtom = (req, res) => {
    res.render('main/910test.html');
};