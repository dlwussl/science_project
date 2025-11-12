const db = require('../../db/db.js');

exports.makeAtom = (req, res) => {
    const {redCount, whiteCount, electronCount} = req.body;

    if (!req.session || !req.session.user || !req.session.user.username) {
        return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }
    const username = req.session.user.username;

    let uid;
    let elementInfo = {}; // 최종적으로 모달에 보낼 원소 정보를 담을 객체

    // 1. 사용자 ID 조회
    db.query('select id from users where username=?', [username], (errUser, resUser) => {
        if (errUser) {
            console.log(errUser);
            return res.status(500).json({ success: false, message: 'DB 오류 (사용자 조회)' });
        }
        if (resUser.length === 0) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }
        uid = resUser[0].id;

        // 2. 'atom' 테이블에서 기호(symbol)와 영문명(name) 조회
        // (atom 테이블이 'isotope' 정보 테이블이라도, proton(redCount) 기준으로 조회하면
        //  어쨌든 해당 원소의 symbol/name을 가져올 수 있다는 전제로 쿼리합니다.)
        db.query('SELECT symbol, name FROM atom WHERE proton = ? LIMIT 1', [redCount], (errAtom, resAtom) => {
            if (errAtom) {
                console.log(errAtom);
                return res.status(500).json({ success: false, message: 'DB 오류 (atom 조회)' });
            }
            if (resAtom.length === 0) {
                // 'atom' 테이블에 해당 양성자 수의 원소(동위원소)가 하나도 등록되지 않은 경우
                return res.status(404).json({ success: false, message: 'atom 테이블에 원소 기본 정보가 없습니다.' });
            }

            // elementInfo 객체에 1차로 정보 할당
            elementInfo.symbol = resAtom[0].symbol;
            elementInfo.name_en = resAtom[0].name; // atom.name 컬럼을 영문명(name_en)으로 사용

            // 3. 'description' 테이블에서 한글명(name_ko)과 설명(description) 조회
            db.query('SELECT name_ko, description FROM description WHERE id = ?', [redCount], (errDesc, resDesc) => {
                if (errDesc) {
                    console.log(errDesc);
                    return res.status(500).json({ success: false, message: 'DB 오류 (description 조회)' });
                }
                if (resDesc.length === 0) {
                    return res.status(404).json({ success: false, message: 'description 테이블에 원소 설명이 없습니다.' });
                }

                // elementInfo 객체에 2차로 정보 할당 (정보 조합 완료)
                elementInfo.name_ko = resDesc[0].name_ko;
                elementInfo.description = resDesc[0].description;

                // 4. 'atom' 테이블에서 정확한 동위원소(isotope) 번호(number) 조회
                db.query('select number from atom where proton = ? and netron = ? and electron = ?', [redCount, whiteCount, electronCount], (errIsotope, resIsotope) => {
                    let historySaved = false;
                    let historyMessage = '';

                    if (errIsotope) {
                        console.log(errIsotope);
                        historyMessage = '동위원소 조회 실패. 히스토리 저장 안됨.';
                        // 조회 실패해도, 모달은 띄워야 하므로 원소 정보는 반환
                        return res.json({
                            success: true,
                            historySaved: false,
                            message: historyMessage,
                            element: elementInfo, // 조합된 원소 정보
                            counts: { red: redCount, white: whiteCount, electron: electronCount }
                        });
                    }

                    if (resIsotope.length === 0) {
                        historyMessage = '일치하는 동위원소가 없어 히스토리에 저장되지 않음';
                        // 동위원소가 없어도, 모달은 띄워야 하므로 원소 정보 반환
                        return res.json({
                            success: true,
                            historySaved: false,
                            message: historyMessage,
                            element: elementInfo,
                            counts: { red: redCount, white: whiteCount, electron: electronCount }
                        });
                    }

                    // 5. 동위원소 발견 시, 'history' 테이블에 삽입
                    const aid = resIsotope[0].number;
                    db.query('insert into history(isotope_number,user_id) values (?,?)', [aid, uid], (errHistory, resHistory) => {
                        if (errHistory) {
                            console.log(errHistory);
                            historyMessage = '히스토리 저장 실패';
                        } else {
                            console.log("History save success");
                            historyMessage = '히스토리 저장 성공';
                            historySaved = true;
                        }

                        // 6. 모든 작업 완료 후 최종 응답
                        res.json({
                            success: true,
                            historySaved: historySaved,
                            message: historyMessage,
                            element: elementInfo, // 최종 조합된 원소 정보
                            counts: { red: redCount, white: whiteCount, electron: electronCount }
                        });
                    });
                });
            });
        });
    });
};
exports.getAtom = (req, res) => {
    res.render('main/910test.html');
};