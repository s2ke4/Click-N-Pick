-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommercedatabase
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_num` int NOT NULL AUTO_INCREMENT,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `seller_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `order_amt` int DEFAULT NULL,
  `address` varchar(500) NOT NULL,
  `dispatch` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`order_num`),
  KEY `user_id` (`user_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (3,'2021-04-02 10:50:02',1,3,20125,'Sri Ram Emporium, old dhan mandi sri vijaynagar,dis. sri ganganagar India - 335704',1),(4,'2021-04-02 10:56:24',1,3,9300,'Sri Ram Emporium, old dhan mandi sri vijaynagar,dis. sri ganganagar India - 335704',1),(5,'2021-04-02 11:11:04',1,3,15975,'Sri Ram Emporium, old dhan mandi sri vijaynagar,dis. sri ganganagar India - 335704',1),(6,'2021-04-06 15:51:55',1,3,978800,'Sri Ram Emporium, old dhan mandi sri vijaynagar, district sri ganganagar India - 335704',1),(7,'2021-04-06 23:18:51',1,3,90000,'Sri Ram Emporium, old dhan mandi sri vijaynagar,dis. sri ganganagar India - 335704',0),(8,'2021-04-06 23:43:31',1,3,950,'Sri Ram Emporium, old dhan mandi sri vijaynagar,dis. sri ganganagar India - 335704',0),(9,'2021-04-14 18:04:54',1,3,105300,'Sri Ram Emporium, old dhan mandi sri vijaynagar,dis. sri ganganagar India - 335704',0),(10,'2021-04-14 18:11:56',1,3,75500,'c wing 2nd floor, Gokuldham Society, Powder Gali, Film City Road Mumbai India - 400001',0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-22 19:12:57
