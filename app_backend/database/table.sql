drop database test;
create database test DEFAULT CHARACTER SET utf8 collate utf8_general_ci;

use test;

insert into tbl_user(username, password, jlpt_level)
value('운영자', 'a1350666', 3);

-- 회원 테이블
create table tbl_user(
	id int primary key auto_increment,
	username varchar(255) not null,
	password varchar(255) not null,
    jlpt_level int default 1,
    point int default 0,
    profile_img int default null comment 'tbl_file.id (FK)',
	is_staff int default 0 comment '0: 일반사용자, 1: 관리자',
	delete_yn varchar(1) default 'N',
	regist_date datetime default now(),
	modify_date datetime default null,
	delete_date datetime default null
) default character set utf8 collate utf8_general_ci;

-- 한자 테이블
create table tbl_japan_store(
	id int primary key auto_increment,
    kanji varchar(255) comment '한자',
    hiragana varchar(255) comment '히라가나',
    hangul varchar(255) comment '한글',
    type varchar(255) comment '명사, 동사, 부사, 형용사',
    level int not null comment 'jlpt 1, 2, 3, 4, 5',
    exam_yn varchar(255) comment '출제 Y, 미출제 N',
    delete_yn varchar(1) default 'N',
	regist_date datetime default now(),
	modify_date datetime default null,
	delete_date datetime default null
) default character set utf8 collate utf8_general_ci;

-- 문제 테이블
create table tbl_japan_problem(
	id int primary key auto_increment,
    store_id int,
    user_id int,
    delete_yn varchar(1) default 'N',
	regist_date datetime default now(),
	modify_date datetime default null,
	delete_date datetime default null
) default character set utf8 collate utf8_general_ci;

-- 채팅 테이블
create table tbl_chat(
	id int primary key auto_increment,
	content varchar(255),
    user_id int not null comment 'tbl_user.id (FK)',
    delete_yn varchar(1) default 'N',
	regist_date datetime default now(),
	modify_date datetime default null,
	delete_date datetime default null
) default character set utf8 collate utf8_general_ci;

-- 파일 관리 테이블
create table tbl_file(
	id int primary key auto_increment,
	file_raw_name varchar(255) comment '파일 이름',
    file_enc_name varchar(255) comment '파일 이름 (인코딩)',
    file_raw_size int comment '파일 사이즈',
    file_unit_size varchar(255) comment '파일 사이즈 (단위)',
    file_ext varchar(255) comment '파일 확장자',
    file_save_path varchar(255) comment '파일경로 (상대경로)',
    user_id int not null comment 'tbl_user.id (FK)',
    delete_yn varchar(1) default 'N',
	regist_date datetime default now(),
	modify_date datetime default null,
	delete_date datetime default null
) default character set utf8 collate utf8_general_ci;
