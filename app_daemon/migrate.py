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


# admin account setting
ADMIN_ID = 'admin'
ADMIN_PW = 'admin'


# bug check
JLPT_N1_PROBLEM_CNT = 2734
JLPT_N2_PROBLEM_CNT = 2266
JLPT_N3_PROBLEM_CNT = 1309
JLPT_N4_PROBLEM_CNT = 881
JLPT_N5_PROBLEM_CNT = 511


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


def insertSampleDate(conn):
    curs = conn.cursor()
    sql = '''
        insert into tbl_user(username, password, is_staff)
        value('{ADMIN_ID}', '{ADMIN_PW}', 1);
    '''.format(ADMIN_ID=ADMIN_ID, ADMIN_PW=ADMIN_PW)
    curs.execute(sql)
    conn.commit()


def dropTable(conn):
    curs = conn.cursor()
    table_list = [
        'tbl_problem_n1',
        'tbl_problem_n2',
        'tbl_problem_n3',
        'tbl_problem_n4',
        'tbl_problem_n5',
        'tbl_problem_free',
        'tbl_user',
        'tbl_japan_store',
        'tbl_chat',
        'tbl_file',
    ]
    for table in table_list:
        sql = '''
            DROP TABLE IF EXISTS `{table}`;
        '''.format(table=table)
        curs.execute(sql)
        print('INFO -> {table} drop SUCCESS'.format(table=table))


def createTable(conn):
    curs = conn.cursor()

    for level in range(1,7):
        if level == 6:
            level = 'free'
        else:
            level = 'n' + str(level)
        sql = '''
            CREATE TABLE IF NOT EXISTS `tbl_problem_{level}` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `store_id` int(11) DEFAULT NULL,
              `user_id` int(11) DEFAULT NULL,
              `delete_yn` varchar(1) DEFAULT 'N',
              `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
              `modify_date` datetime DEFAULT NULL,
              `delete_date` datetime DEFAULT NULL,
              PRIMARY KEY (`id`)
            ) default character set utf8 collate utf8_general_ci;
        '''.format(level=level)
        curs.execute(sql)
        print('INFO -> tbl_problem_{level} create SUCCESS'.format(level=level))

    sql = '''
        CREATE TABLE IF NOT EXISTS `tbl_user` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `username` varchar(255) NOT NULL,
          `password` varchar(255) NOT NULL,
          `jlpt_level` int(11) DEFAULT '1',
          `point` int(11) DEFAULT '0',
          `profile_img` int(11) DEFAULT NULL COMMENT 'tbl_file.id (FK)',
          `is_staff` int(11) DEFAULT '0' COMMENT '0: 일반사용자, 1: 관리자',
          `delete_yn` varchar(1) DEFAULT 'N',
          `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
          `modify_date` datetime DEFAULT NULL,
          `delete_date` datetime DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) default character set utf8 collate utf8_general_ci;
    '''
    curs.execute(sql)
    print('INFO -> tbl_user create SUCCESS')

    sql = '''
        CREATE TABLE IF NOT EXISTS `tbl_japan_store` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `kanji` varchar(255) DEFAULT NULL COMMENT '한자',
          `hiragana` varchar(255) DEFAULT NULL COMMENT '히라가나',
          `hangul` varchar(255) DEFAULT NULL COMMENT '한글',
          `type` varchar(255) DEFAULT NULL COMMENT '명사, 동사, 부사, 형용사',
          `level` int(11) NOT NULL COMMENT 'jlpt 1, 2, 3, 4, 5',
          `check_free_yn` varchar(255) DEFAULT 'N' COMMENT '출제 Y, 미출제 N / 자유서버',
          `check_each_yn` varchar(255) DEFAULT 'N' COMMENT '출제 Y, 미출제 N / 각 난이도서버',
          `delete_yn` varchar(1) DEFAULT 'N',
          `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
          `modify_date` datetime DEFAULT NULL,
          `delete_date` datetime DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) default character set utf8 collate utf8_general_ci;
    '''
    curs.execute(sql)
    print('INFO -> tbl_japan_store create SUCCESS')

    sql = '''
        CREATE TABLE IF NOT EXISTS `tbl_chat` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `content` varchar(255) DEFAULT NULL,
          `user_id` int(11) NOT NULL COMMENT 'tbl_user.id (FK)',
          `delete_yn` varchar(1) DEFAULT 'N',
          `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
          `modify_date` datetime DEFAULT NULL,
          `delete_date` datetime DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) default character set utf8 collate utf8_general_ci;
    '''
    curs.execute(sql)
    print('INFO -> tbl_chat create SUCCESS')

    sql = '''
        CREATE TABLE IF NOT EXISTS `tbl_file` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `file_raw_name` varchar(255) DEFAULT NULL COMMENT '파일 이름',
          `file_enc_name` varchar(255) DEFAULT NULL COMMENT '파일 이름 (인코딩)',
          `file_raw_size` int(11) DEFAULT NULL COMMENT '파일 사이즈',
          `file_unit_size` varchar(255) DEFAULT NULL COMMENT '파일 사이즈 (단위)',
          `file_ext` varchar(255) DEFAULT NULL COMMENT '파일 확장자',
          `file_save_path` varchar(255) DEFAULT NULL COMMENT '파일경로 (상대경로)',
          `user_id` int(11) NOT NULL COMMENT 'tbl_user.id (FK)',
          `delete_yn` varchar(1) DEFAULT 'N',
          `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
          `modify_date` datetime DEFAULT NULL,
          `delete_date` datetime DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) default character set utf8 collate utf8_general_ci;
    '''
    curs.execute(sql)
    print('INFO -> tbl_file create SUCCESS')


def readData(JLPT_LEVEL):
    file_path = "./word_store/jlpt"+str(JLPT_LEVEL)+".txt"
    print('file_path -> ', file_path)
    f = open(file_path, 'r', encoding="utf-8-sig")
    dataSet = []
    while True:
        line = f.readline()
        if not line: break
        line = line.strip().split('\t')
        hanja = line[0].replace('[', '').replace(']', '').replace('-', '')
        hiragana = line[3]
        hangul = line[5].replace("['", '').replace("']", '')

        if hangul.find('[명사]') != -1:
            type = '명사'
        elif hangul.find('[형용사]') != -1:
            type = '형용사'
        elif hangul.find('[동사]') != -1:
            type = '동사'
        elif hangul.find('[부사]') != -1:
            type = '부사'
        elif hangul.find('[형용동사]') != -1:
            type = '형용동사'
        elif hangul.find('[감동사]') != -1:
            type = '감동사'
        elif hangul.find('[대명사]') != -1:
            type = '대명사'
        elif hangul.find('[조사]') != -1:
            type = '조사'
        elif hangul.find('[접사]') != -1:
            type = '접사'
        elif hangul.find('[기타]') != -1:
            type = '기타'
        else:
            pass
        hangul = hangul.replace('[' + type + ']', '')
        dataSet.append(
            {
                'hanja': hanja,
                'hiragana': hiragana,
                'hangul': hangul,
                'type': type,
            }
        )
    f.close()
    return dataSet


def migrateData(conn, dataSet, JLPT_LEVEL):
    curs = conn.cursor()
    for data in dataSet:
        hanja = data['hanja']
        hiragana = data['hiragana']
        hangul = data['hangul']
        type = data['type']
        level = JLPT_LEVEL

        sql = '''
            insert into tbl_japan_store(kanji, hiragana, hangul, type, level)
            value('{hanja}', '{hiragana}', '{hangul}', '{type}', {level});
        '''.format(
            hanja=hanja,
            hiragana=hiragana,
            hangul=hangul,
            type=type,
            level=level)
        curs.execute(sql)
    conn.commit()


def migrateCheck(conn, JLPT_LEVEL):
    curs = conn.cursor()
    sql = '''
        select count(*)
        from tbl_japan_store
        where level = {level};
    '''.format(level = JLPT_LEVEL)
    curs.execute(sql)
    data_cnt = curs.fetchall()[0][0]
    if(JLPT_LEVEL == 1 and data_cnt == JLPT_N1_PROBLEM_CNT):
        result = 'SUCCESS'
    elif(JLPT_LEVEL == 2 and data_cnt == JLPT_N2_PROBLEM_CNT):
        result = 'SUCCESS'
    elif(JLPT_LEVEL == 3 and data_cnt == JLPT_N3_PROBLEM_CNT):
        result = 'SUCCESS'
    elif(JLPT_LEVEL == 4 and data_cnt == JLPT_N4_PROBLEM_CNT):
        result = 'SUCCESS'
    elif(JLPT_LEVEL == 5 and data_cnt == JLPT_N5_PROBLEM_CNT):
        result = 'SUCCESS'
    else:
        result = 'FAIL'
    return result


def startPoint():
    return time.time()


def endPoint(startTime):
    checkTime = time.time() - startTime
    print('Execution time ... {checkTime} sec'.format(checkTime=round(checkTime, 2)))


if __name__ == "__main__":
    conn = databaseConnect()
    dropTable(conn)
    createTable(conn)
    for JLPT_LEVEL in range(1,6):
        startTime = startPoint()
        dataSet = readData(JLPT_LEVEL)
        result = migrateCheck(conn, JLPT_LEVEL)
        if result == 'FAIL':
            migrateData(conn, dataSet, JLPT_LEVEL)
            result = migrateCheck(conn, JLPT_LEVEL)
            print('Migration Result is {result} : level N{JLPT_LEVEL}'.format(result=result, JLPT_LEVEL=JLPT_LEVEL))
        else:
            print('Migration has already been completed : level N{JLPT_LEVEL}'.format(JLPT_LEVEL=JLPT_LEVEL))

        endPoint(startTime)
    insertSampleDate(conn)
    databaseClose(conn)
