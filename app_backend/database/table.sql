drop database test;
create database test DEFAULT CHARACTER SET utf8 collate utf8_general_ci;

use test;

-- 회원 테이블
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

-- 문제테이블 (N1)
CREATE TABLE IF NOT EXISTS `tbl_problem_n1` (
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
CREATE TABLE IF NOT EXISTS `tbl_problem_n3` (
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
CREATE TABLE IF NOT EXISTS `tbl_problem_n4` (
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
CREATE TABLE IF NOT EXISTS `tbl_problem_n5` (
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
CREATE TABLE IF NOT EXISTS `tbl_problem_free` (
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

-- 채팅 테이블
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

-- 파일 관리 테이블
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
