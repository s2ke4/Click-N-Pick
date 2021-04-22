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
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_name` text,
  `brand_name` text,
  `price` int DEFAULT NULL,
  `discount` int DEFAULT NULL,
  `num_of_items` int DEFAULT NULL,
  `product_color` text,
  `category` text,
  `prod_description` text,
  `seller_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `seller` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (17,'MacBook','Apple',100000,10,0,'White,Black','electronics','Specification\n8GB Ram,\nI7',1),(18,'oppo F15','Oppo',13880,33,7,'Black,Red','electronics','4gb ram\n64gb memory\n32px rear camera',1),(19,'Samsung Galaxy A20s','Samsung',12000,10,138,'White,Black','grocery','Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \'de Finibus Bonorum et Malorum\' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \'Lorem ipsum dolor sit amet..\', comes from a line in section 1.10.32.\n\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \'de Finibus Bonorum et Malorum\' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',1),(20,'Acer Swift 3 AMD Ryzen 5','Acer',50000,10,108,'Black, White','electronics','Processor : AMD Ryzen 5 4500U hexa-core processor with max turbo upto 4.0Ghz | RAM : 8 GB of onboard LPDDR4 system memory\nDisplay : 14\' display with IPS (In-Plane Switching) technology, Full HD 1920 x 1080, high-brightness Acer ComfyView LED-backlit TFT LCD\nGraphics : AMD Radeon Graphics | Additional: Alexa Enabled\nStorage : 512 GB, PCIe Gen3 8 Gb/s up to 4 lanes, NVMe SSD',1),(21,'dummy product','dummy',1000,5,0,'Black, Red','kitchen','dummy',1),(22,'dummy product name','brand name',10000,7,120,'White','kitchen','this is dummy text for dummy item',1),(23,'Tv','Samsung',25000,2,98,'Black','electronics','32 inch led',1),(24,'Dummy Item Name','Dummy Brand Name',1500,12,12,'black','kitchen','lorem ipsum',1),(25,'dummy grocerry','jlkdjoi',12000,50,1114,'..','grocery','DUMMY',1),(28,'Super Cool Watch','MI',3500,5,96,'Black','grocery','A very nice watch with high power and all functionality',1),(29,'New Apple iPhone 12 Mini (64GB) - Black','Apple',100000,15,120,'Black','Electronics','5.4-inch (13.7 cm diagonal) Super Retina XDR display\nCeramic Shield, tougher than any smartphone glass\nA14 Bionic chip, the fastest chip ever in a smartphone\nAdvanced dual-camera system with 12MP Ultra Wide and Wide cameras; Night mode, Deep Fusion, Smart HDR 3, 4K Dolby Vision HDR recording\n12MP TrueDepth front camera with Night mode, 4K Dolby Vision HDR recording\nIndustry-leading IP68 water resistance\nSupports MagSafe accessories for easy attach and faster wireless charging\niOS with redesigned widgets on the Home screen, all-new App Library, App Clips and more',1);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-22 19:12:56
