drop database test;
create database test DEFAULT CHARACTER SET utf8 collate utf8_general_ci;

use test;

-- 샘플 데이터
insert into tbl_user(username, password, jlpt_level)
value('admin', 'password', 3);

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

-- 문제테이블 (N1)
CREATE TABLE `tbl_problem_n1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `delete_yn` varchar(1) DEFAULT 'N',
  `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) default character set utf8 collate utf8_general_ci;

-- 문제테이블 (N2)
CREATE TABLE `tbl_problem_n2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `delete_yn` varchar(1) DEFAULT 'N',
  `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) default character set utf8 collate utf8_general_ci;

-- 문제테이블 (N3)
CREATE TABLE `tbl_problem_n3` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `delete_yn` varchar(1) DEFAULT 'N',
  `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) default character set utf8 collate utf8_general_ci;

-- 문제테이블 (N4)
CREATE TABLE `tbl_problem_n4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `delete_yn` varchar(1) DEFAULT 'N',
  `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) default character set utf8 collate utf8_general_ci;

-- 문제테이블 (N5)
CREATE TABLE `tbl_problem_n5` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `delete_yn` varchar(1) DEFAULT 'N',
  `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) default character set utf8 collate utf8_general_ci;

-- 문제테이블 (자유)
CREATE TABLE `tbl_problem_free` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `delete_yn` varchar(1) DEFAULT 'N',
  `regist_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) default character set utf8 collate utf8_general_ci;

-- 한자 보관 테이블
CREATE TABLE `tbl_japan_store` (
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
