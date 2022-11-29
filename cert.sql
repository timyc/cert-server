-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 29, 2022 at 01:46 AM
-- Server version: 10.3.35-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `certitude`
--

-- --------------------------------------------------------

--
-- Table structure for table `links`
--

CREATE TABLE `links` (
  `user` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `platform` int(11) NOT NULL DEFAULT 1,
  `expires` datetime NOT NULL DEFAULT '2099-01-01 11:11:11'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `links`
--

INSERT INTO `links` (`user`, `url`, `platform`, `expires`) VALUES
(1, 'b26dc4093bc79429218b53a97529d026633da9f34438c', 1, '2022-10-06 08:59:47'),
(3, 'd50a859d0aff851a36296fcde388f0516385375e35707', 1, '2099-01-01 11:11:11'),
(23, 'fffdfffd30fffd3ffffd234046fffdff63845259c5585', 1, '2099-01-01 11:11:11'),
(5, 'fffdfffdfffd1cfffdfffdfffd42fffd638457272d926', 1, '2099-01-01 11:11:11');

-- --------------------------------------------------------

--
-- Table structure for table `platforms`
--

CREATE TABLE `platforms` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `platforms`
--

INSERT INTO `platforms` (`id`, `name`, `json`) VALUES
(1, 'Bangkok Hiring Firm', '{}'),
(2, 'Ligma Sugma Talent Acquisition', '{}'),
(3, 'Big Money, LLC', '{}');

-- --------------------------------------------------------

--
-- Table structure for table `universities`
--

CREATE TABLE `universities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = unverified\r\n1 = verified',
  `auth_type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 = Shibboleth\r\n2 = Something else',
  `auth_url` varchar(255) NOT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `universities`
--

INSERT INTO `universities` (`id`, `name`, `image`, `verified`, `auth_type`, `auth_url`, `json`) VALUES
(1, 'Willy Wonka Culinary University', 'https://i.imgur.com/xqEIEWu.png', 0, 1, 'https://wonka.edu/choccymilk', '{\"secret\":\"j1hhss892723873\",\"txt\":\"thingything\"}'),
(2, 'Cape Cod College', 'https://upload.wikimedia.org/wikipedia/en/9/90/CapeCodCommunityCollegeSeal.png', 0, 1, 'https://ccc.edu/dingdong', '{\"secret\":\"jddjjdf20873\",\"txt\":\"boo\"}'),
(3, 'University of Alabama', 'https://i.imgur.com/w7xiAxP.gif', 0, 1, 'https://alabama.edu/shib', '{\"secret\":\"jddjjdf20873\",\"txt\":\"boo\"}'),
(4, 'OnlyFans Institute, Elderly Division', 'https://i.imgur.com/21B7eeS.png', 0, 1, 'https://onlyfans.com/elderly', '{\"secret\":\"jddjjdf20873\",\"txt\":\"boo\"}'),
(5, 'Delta University of Game Design', 'https://i.imgur.com/21B7eeS.png', 1, 1, 'https://edu.delta.games/idp/shibboleth', '{\"secret\":\"jddjjdf20873\",\"txt\":\"boo\",\"sIP\":\"185.99.135.33\",\"sPort\":8081}');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `firebase_uid` varchar(128) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL,
  `avatar` varchar(128) NOT NULL DEFAULT '',
  `access` int(11) NOT NULL DEFAULT 1,
  `platform_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firebase_uid`, `name`, `email`, `avatar`, `access`, `platform_id`) VALUES
(1, 'lGu0XE6RCxcnZLf9zlckWjYsWjy2', 'Tim Chen', 'timyc2@uci.edu', '', 69, 1),
(2, 'xI2CdAJOUQcfGNwx6FAuUWNfIxJ2', 'Tim Chen', 'timchen1901@gmail.com', '', 1, NULL),
(3, 'fveHpdl4ygVUD7EligTLb4JngVE3', 'Mark Zuckerberg', 'mark@facebook.com', 'https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg', 1, NULL),
(4, 'HzoW3vBDWrWywAqiFHcsyTlcKoN2', 'Jay Brennan', 'mh01mh09@gmail.com', '', 1, NULL),
(5, 'ymxFrU36tgTwzVT0bH5E2x6cy522', 'Jeff Hover', 'hoverj@uci.edu', '', 1, NULL),
(6, 'BDzsV5ZSvQg6uFPSBxR959JgXGW2', 'Robert Armen Missirian', 'missirir@uci.edu', '', 1, NULL),
(7, '6Jq038O8OEWIxFISVe1fIsMWs4n1', 'Orangutan Capital Investments LTD', 'orangutan@princeton.edu', '', 1, NULL),
(8, 'Oz3kBpred9gCggUb0ADmtzL2DTk2', 'Jason Nguyen', 'nguyenjason8830@gmail.com', '', 1, NULL),
(9, 'Ulb7KiuVn7YansZP90lAnb0aEa32', 'Jason Huy Nguyen', 'jasonhn1@uci.edu', '', 1, NULL),
(10, 't42tEG5FF9WekT9WOL9mX771kfm2', 'Tim Chen', 'tim@delta.games', '', 1, NULL),
(11, 'VRw8p89IY8SjQtR0Bki5HI4SiYL2', 'Bill Gates', 'bill@microsoft.com', '', 1, NULL),
(12, 'BBEJZy01ahT6VaQGZ7njUxqDz712', 'Joe McDonald', 'joe@mcdonalds.com', '', 1, NULL),
(13, 'eregpZLueRPL4kPCWJo6NaGMxq72', 'Donald Trump', 'donaldtrump@whitehouse.gov', '', 1, NULL),
(14, 'YrBWR30iMYPtGYb4xkoyuz3DUnG2', 'Joe Biden', 'joebiden@whitehouse.gov', '', 1, NULL),
(15, 'vmZwSx0NwKQNCSJP4IRl0i6AaY32', 'Another Test', 'anothertest@gmail.com', '', 1, NULL),
(16, 'tlmizmY0e9WeOEecV5iuubzP4Pt2', 'Final Test', 'finaltest@gmail.com', '', 1, NULL),
(17, '303w8vZvXWX8Kj1r2GvQ8fvse1M2', 'Bob the Builder', 'bob@builders.com', '', 1, NULL),
(18, 'oceTeskNlyZgPYM8U2OhOkZnEsu2', 'Jode Biden', 'joe@biden.com', '', 1, NULL),
(19, 'yyxgQC0IBfNEx1PpunqbackVbci1', 'Hunter Biden', 'joebiden2@whitehouse.gov', '', 1, NULL),
(20, '0DbN58kVATZLzin3QKm533hw6BG2', 'SC', 'wd@aol.com', '', 1, NULL),
(21, 'Wuv1eg8aNVY6nJUV53ypcshTAsr2', 'Jeff Hover', 'fake@email.com', '', 1, NULL),
(22, 'OkQR1P2dOkZZqdUX9YsJklrem6c2', 'Fake Person', 'fake1@email.com', '', 1, NULL),
(23, 'BTMjCHMV8Yc6SuoMIqLE3oEJlS43', 'Not a Person', 'fake2@email.com', '', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_universities`
--

CREATE TABLE `users_universities` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `uni_id` int(10) UNSIGNED NOT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_universities`
--

INSERT INTO `users_universities` (`user_id`, `uni_id`, `json`) VALUES
(1, 1, '[{\"highest_degree\":1,\"begin_date\":\"2018-09-15\",\"end_date\":\"2022-07-18\",\"degree_name\":\"Chocolate Tasting\"}]'),
(1, 4, '[{\"highest_degree\":4,\"begin_date\":\"2018-10-12\",\"end_date\":\"2023-01-12\",\"degree_name\":\"Catfishing\"}]'),
(1, 5, '[{\"highest_degree\":2,\"degree_name\":\"Political Science\",\"gpa\":2,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"},{\"highest_degree\":3,\"degree_name\":\"Video Production\",\"gpa\":2.5,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\",\"holder\":\"Tim Chen XIV, Esq.\"}]'),
(2, 3, '[{\"highest_degree\":2,\"begin_date\":\"2018-10-12\",\"end_date\":\"2023-01-12\",\"degree_name\":\"Pants Shitting\"}]'),
(2, 5, '[{\"highest_degree\":1,\"degree_name\":\"Abstract Geometry\",\"gpa\":1.1,\"begin_date\":\"2018-04-01\",\"end_date\":\"2022-06-02\"},{\"highest_degree\":2,\"degree_name\":\"Gender Studies\",\"gpa\":3.9,\"begin_date\":\"2018-04-01\",\"end_date\":\"2022-06-02\"}]'),
(3, 2, '[{\"highest_degree\":2,\"begin_date\":\"2018-10-12\",\"end_date\":\"2023-01-12\",\"degree_name\":\"Law Breaking\"}]'),
(3, 5, '[{\"highest_degree\":2,\"degree_name\":\"Political Science\",\"gpa\":2,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"},{\"highest_degree\":3,\"degree_name\":\"Video Production\",\"gpa\":2.5,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\",\"holder\":\"Tim Chen XIV, Esq.\"}]'),
(5, 5, '[{\"highest_degree\":4,\"degree_name\":\"Game Design\",\"gpa\":6.9,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"},{\"highest_degree\":1,\"degree_name\":\"Software Architecture\",\"gpa\":1.7,\"begin_date\":\"2019-10-16\",\"end_date\":\"2023-10-19\"}]'),
(10, 5, '[{\"highest_degree\":1,\"degree_name\":\"Abstract Geometry\",\"gpa\":1.1,\"begin_date\":\"2018-04-01\",\"end_date\":\"2022-06-02\"},{\"highest_degree\":2,\"degree_name\":\"Gender Studies\",\"gpa\":3.9,\"begin_date\":\"2018-04-01\",\"end_date\":\"2022-06-02\"}]'),
(11, 1, '[{\"highest_degree\":4,\"begin_date\":\"2010-10-12\",\"end_date\":\"2021-01-12\",\"degree_name\":\"Business Administration\"}]'),
(11, 2, '[{\"highest_degree\":1,\"begin_date\":\"2020-10-12\",\"end_date\":\"2023-01-12\",\"degree_name\":\"Sweatshop Commanding\"}]'),
(11, 3, '[{\"highest_degree\":3,\"begin_date\":\"2018-10-12\",\"end_date\":\"2023-01-12\",\"degree_name\":\"Family History\"},{\"highest_degree\":2,\"begin_date\":\"2018-10-12\",\"end_date\":\"2023-01-12\",\"degree_name\":\"Other Major\"}]'),
(12, 5, '[{\"highest_degree\":1,\"degree_name\":\"Abstract Geometry\",\"gpa\":1.1,\"begin_date\":\"2018-04-01\",\"end_date\":\"2022-06-02\"},{\"highest_degree\":2,\"degree_name\":\"Gender Studies\",\"gpa\":3.9,\"begin_date\":\"2018-04-01\",\"end_date\":\"2022-06-02\"}]'),
(16, 5, '[{\"highest_degree\":2,\"degree_name\":\"Political Science\",\"gpa\":2,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"},{\"highest_degree\":3,\"degree_name\":\"Video Production\",\"gpa\":2.5,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"}]'),
(17, 5, '[{\"highest_degree\":2,\"degree_name\":\"Political Science\",\"gpa\":2,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"},{\"highest_degree\":3,\"degree_name\":\"Video Production\",\"gpa\":2.5,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"}]'),
(18, 5, '[{\"highest_degree\":1,\"degree_name\":\"Abstract Geometry\",\"gpa\":1.1,\"begin_date\":\"2018-04-01\",\"end_date\":\"2022-06-02\"},{\"highest_degree\":2,\"degree_name\":\"Gender Studies\",\"gpa\":3.9,\"begin_date\":\"2018-04-01\",\"end_date\":\"2022-06-02\"}]'),
(19, 5, '[{\"highest_degree\":2,\"degree_name\":\"Political Science\",\"gpa\":2,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"},{\"highest_degree\":3,\"degree_name\":\"Video Production\",\"gpa\":2.5,\"begin_date\":\"2012-09-03\",\"end_date\":\"2014-02-05\"}]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD UNIQUE KEY `url` (`url`),
  ADD UNIQUE KEY `user` (`user`,`platform`);

--
-- Indexes for table `platforms`
--
ALTER TABLE `platforms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_universities`
--
ALTER TABLE `users_universities`
  ADD UNIQUE KEY `user_id` (`user_id`,`uni_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `platforms`
--
ALTER TABLE `platforms`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `universities`
--
ALTER TABLE `universities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
