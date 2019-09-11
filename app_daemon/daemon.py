import pymysql
import time
import json
import socketio


# Repeat time
REPEAT_SEC = 15


# change the information in database.json
f = open("database.json", 'r')
line = f.readline()
databaseInfo = json.loads(line)
f.close()


# database config
DB_HOST     = databaseInfo['DB_HOST']
DB_USER     = databaseInfo['DB_USER']
DB_PASSWORD = databaseInfo['DB_PASSWORD']
DB_NAME     = databaseInfo['DB_NAME']


# socketio config
SOCKET_CONNECT_URL = databaseInfo['SOCKET_URL']


def databaseConnect():
    conn = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME,
        charset='utf8')
    return conn


def databaseClose(conn):
    conn.close()


def sendKanji(sio, level, kanji, rotateCnt, roundCnt, reloadCnt):
    print('DEBUG -> rotateCnt : ', rotateCnt)
    print('DEBUG -> roundCnt : ', roundCnt)
    print('DEBUG -> reloadCnt : ', reloadCnt)
    level = level.lower()
    channel = 'kanji_' + level
    payload = {
        'kanji': kanji,
        'rotateCnt': rotateCnt,
        'roundCnt': roundCnt,
        'reloadCnt': reloadCnt
    }
    sio.emit(channel, payload)


def getMoreInfo(conn, level):
    curs = conn.cursor()
    if level == 'N1':
        round_query = "select count(*) as cnt from tbl_japan_store where level=1 and check_each_yn = 'Y'"
        rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n1'"
    elif level == 'N2':
        round_query = "select count(*) as cnt from tbl_japan_store where level=2 and check_each_yn = 'Y'"
        rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n2'"
    elif level == 'N3':
        round_query = "select count(*) as cnt from tbl_japan_store where level=3 and check_each_yn = 'Y'"
        rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n3'"
    elif level == 'N4':
        round_query = "select count(*) as cnt from tbl_japan_store where level=4 and check_each_yn = 'Y'"
        rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n4'"
    elif level == 'N5':
        round_query = "select count(*) as cnt from tbl_japan_store where level=5 and check_each_yn = 'Y'"
        rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n5'"
    elif level == 'Free':
        round_query = "select count(*) as cnt from tbl_japan_store where check_free_yn = 'Y'"
        rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_free'"

    reload_query = "select global_value from tbl_global_var where global_key = 'reload_time'"

    curs.execute(round_query)
    roundCnt = curs.fetchall()[0][0]

    curs.execute(rotate_query)
    rotateCnt = curs.fetchall()[0][0]

    curs.execute(reload_query)
    reloadCnt = curs.fetchall()[0][0]

    # return 로테이트 / 회차 / 문제생성간격
    return rotateCnt, roundCnt, reloadCnt


def getKanjiInStore(conn, level):
    curs = conn.cursor()
    if level == 'N1':
        sql = '''
            select id, kanji, hiragana, hangul, type, level
            from tbl_japan_store
            where level = 1
            and kanji != ''
            and check_each_yn = 'N';
        '''
    elif level == 'N2':
        sql = '''
            select id, kanji, hiragana, hangul, type, level
            from tbl_japan_store
            where level = 2
            and kanji != ''
            and check_each_yn = 'N';
        '''
    elif level == 'N3':
        sql = '''
            select id, kanji, hiragana, hangul, type, level
            from tbl_japan_store
            where level = 3
            and kanji != ''
            and check_each_yn = 'N';
        '''
    elif level == 'N4':
        sql = '''
            select id, kanji, hiragana, hangul, type, level
            from tbl_japan_store
            where level = 4
            and kanji != ''
            and check_each_yn = 'N';
        '''
    elif level == 'N5':
        sql = '''
            select id, kanji, hiragana, hangul, type, level
            from tbl_japan_store
            where level = 5
            and kanji != ''
            and check_each_yn = 'N';
        '''
    elif level == 'Free':
        sql = '''
            select id, kanji, hiragana, hangul, type, level
            from tbl_japan_store
            where check_free_yn = 'N'
            and kanji != '';
        '''
    curs.execute(sql)
    return curs.fetchall()


def rollbackBasePoint(conn, level):
    curs = conn.cursor()
    if level == 'N1':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 1;
        '''
        rotateIncreseSql = '''
            update tbl_global_var
            set global_value = global_value + 1
            where global_key = 'rotate_n1';
        '''
    elif level == 'N2':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 2;
        '''
        rotateIncreseSql = '''
            update tbl_global_var
            set global_value = global_value + 1
            where global_key = 'rotate_n2';
        '''
    elif level == 'N3':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 3;
        '''
        rotateIncreseSql = '''
            update tbl_global_var
            set global_value = global_value + 1
            where global_key = 'rotate_n3';
        '''
    elif level == 'N4':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 4;
        '''
        rotateIncreseSql = '''
            update tbl_global_var
            set global_value = global_value + 1
            where global_key = 'rotate_n4';
        '''
    elif level == 'N5':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 5;
        '''
        rotateIncreseSql = '''
            update tbl_global_var
            set global_value = global_value + 1
            where global_key = 'rotate_n5';
        '''
    elif level == 'Free':
        sql = '''
            update tbl_japan_store
            set check_free_yn = 'N';
        '''
        rotateIncreseSql = '''
            update tbl_global_var
            set global_value = global_value + 1
            where global_key = 'rotate_free';
        '''
    curs.execute(sql)
    curs.execute(rotateIncreseSql)
    conn.commit()


def checkProblemData(conn, level):
    curs = conn.cursor()
    level = level.lower()
    sql = '''
        select count(*)
        from tbl_problem_{level}
        where user_id is null;
    '''.format(level=level)
    curs.execute(sql)
    check = curs.fetchall()[0][0]
    if check == 0:
        return True
    else:
        return False


def createProblem(conn, level, id):
    curs = conn.cursor()
    level = level.lower()
    sql = '''
        insert into tbl_problem_{level}(store_id)
        value({id});
    '''.format(level=level, id=id)
    curs.execute(sql)
    if level == 'free':
        sql = '''
            update tbl_japan_store
            set check_free_yn = 'Y'
            where id = {id};
        '''.format(id=id)
    else:
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'Y'
            where id = {id};
        '''.format(id=id)
    curs.execute(sql)
    conn.commit()


def createProblemTask(level):

    sio = socketio.Client()
    sio.connect(SOCKET_CONNECT_URL)
    conn = databaseConnect()
    kanjiList = getKanjiInStore(conn, level)
    if len(kanjiList) == 0:
        rollbackBasePoint(conn, level)
    else:
        id = kanjiList[0][0]
        kanji = kanjiList[0][1]
        print('DEBUG -> level : ', level)
        print('DEBUG -> id : ', id)
        print('DEBUG -> kanji : ', kanji)
        check = checkProblemData(conn, level)
        if check == True:
            createProblem(conn, level, id)
            rotateCnt, roundCnt, reloadCnt = getMoreInfo(conn, level)
            sendKanji(sio, level, kanji, rotateCnt, roundCnt, reloadCnt)
            print('INFO -> I entered the quiz into the database')
        else:
            pass
            print("INFO -> 'It's not a target")
    databaseClose(conn)
    sio.disconnect()


if __name__ == "__main__":
    while(True):
        for level in range(1,7):
            level = 'N' + str(level)
            if level == 'N6':
                level = 'Free'
            createProblemTask(level)
        time.sleep(REPEAT_SEC)
