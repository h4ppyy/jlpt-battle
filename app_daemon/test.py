import pymysql
import time
import json


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


# 데이터베이스의 데이터를 초기의 상태로 돌립니다
def initData(conn):
    curs = conn.cursor()
    sql = '''
        delete from tbl_problem_n1;
    '''
    curs.execute(sql)
    sql = '''
        delete from tbl_problem_n2;
    '''
    curs.execute(sql)
    sql = '''
        delete from tbl_problem_n3;
    '''
    curs.execute(sql)
    sql = '''
        delete from tbl_problem_n4;
    '''
    curs.execute(sql)
    sql = '''
        delete from tbl_problem_n5;
    '''
    curs.execute(sql)
    sql = '''
        delete from tbl_problem_free;
    '''
    curs.execute(sql)
    sql = '''
        update tbl_japan_store
        set check_each_yn = 'N', check_free_yn = 'N';
    '''
    curs.execute(sql)
    conn.commit()


# 봇이 문제를 풀어줍니다
def botSolveProblem(conn, level):
    curs = conn.cursor()
    sql = '''
        update tbl_problem_n1
        set user_id = 1, modify_date = now()
        where user_id is null;
    '''
    curs.execute(sql)
    conn.commit()


if __name__ == "__main__":
    conn = databaseConnect()
    """
    # Sample Code -----------------
    initData(conn)
    botSolveProblem(conn, 'n1')
    botSolveProblem(conn, 'n2')
    botSolveProblem(conn, 'n3')
    botSolveProblem(conn, 'n4')
    botSolveProblem(conn, 'n5')
    """

    REPEAT_SEC = 3
    while(True):
        botSolveProblem(conn, 'n1')
        print('INFO -> Bot solved the quiz')
        time.sleep(REPEAT_SEC)

    databaseClose(conn)
