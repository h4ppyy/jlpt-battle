import pymysql
import time
import json
import asyncio
import socketio


# Repeat time
REPEAT_SEC = 10


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
SOCKET_CONNECT_URL = 'http://localhost:4000'


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


def sendKanji(sio, level, kanji):
    level = level.lower()
    channel = 'kanji_' + level
    sio.emit(channel, kanji)


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
    elif level == 'N2':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 2;
        '''
    elif level == 'N3':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 3;
        '''
    elif level == 'N4':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 4;
        '''
    elif level == 'N5':
        sql = '''
            update tbl_japan_store
            set check_each_yn = 'N'
            where level = 5;
        '''
    elif level == 'Free':
        sql = '''
            update tbl_japan_store
            set check_free_yn = 'N';
        '''
    curs.execute(sql)
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


async def createProblemTask(level):

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
            sendKanji(sio, level, kanji)
            print('INFO -> I entered the quiz into the database')
        else:
            pass
            print("INFO -> 'It's not a target")
    databaseClose(conn)
    sio.disconnect()


async def main():
    while(True):
        task1 = asyncio.create_task(
            createProblemTask('N1')
        )

        task2 = asyncio.create_task(
            createProblemTask('N2')
        )

        task3 = asyncio.create_task(
            createProblemTask('N3')
        )

        task4 = asyncio.create_task(
            createProblemTask('N4')
        )

        task5 = asyncio.create_task(
            createProblemTask('N5')
        )

        task6 = asyncio.create_task(
            createProblemTask('Free')
        )
        print(f"INFO -> started at {time.strftime('%X')}")
        await task1
        await task2
        await task3
        await task4
        await task5
        await task6
        print(f"INFO -> finished at {time.strftime('%X')}\n")
        time.sleep(REPEAT_SEC)


asyncio.run(main())
