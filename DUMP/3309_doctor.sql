-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: 3309
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `staff_id` int NOT NULL,
  `specialty` text,
  PRIMARY KEY (`staff_id`),
  CONSTRAINT `FK_Doctor_Staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (4,'Emergency medicine'),(6,'Dermatology'),(22,'Emergency medicine'),(23,'Internal medicine'),(27,'Surgery'),(33,'Emergency medicine'),(38,'Surgery'),(41,'Surgery'),(42,'Surgery'),(45,'Surgery'),(47,'Emergency medicine'),(51,'Dermatology'),(54,'Surgery'),(57,'Dermatology'),(60,'Family medicine'),(61,'Family medicine'),(67,'Dermatology'),(76,'Family medicine'),(79,'Emergency medicine'),(85,'Dermatology'),(87,'Dermatology'),(91,'Emergency medicine'),(92,'Emergency medicine'),(93,'Dermatology'),(94,'Surgery'),(95,'Dermatology'),(96,'Surgery'),(97,'Internal medicine'),(99,'Surgery'),(101,'Dermatology'),(102,'Surgery'),(108,'Family medicine'),(109,'Surgery'),(118,'Family medicine'),(125,'Internal medicine'),(126,'Family medicine'),(133,'Emergency medicine'),(136,'Dermatology'),(138,'Family medicine'),(144,'Emergency medicine'),(146,'Surgery'),(147,'Emergency medicine'),(148,'Surgery'),(149,'Surgery'),(152,'Emergency medicine'),(159,'Emergency medicine'),(161,'Family medicine'),(166,'Surgery'),(168,'Family medicine'),(173,'Emergency medicine'),(174,'Surgery'),(184,'Family medicine'),(185,'Dermatology'),(189,'Emergency medicine'),(191,'Surgery'),(199,'Family medicine'),(200,'Emergency medicine'),(203,'Dermatology'),(205,'Emergency medicine'),(209,'Emergency medicine'),(211,'Internal medicine'),(214,'Family medicine'),(216,'Dermatology'),(222,'Dermatology'),(223,'Family medicine'),(224,'Surgery'),(232,'Surgery'),(240,'Family medicine'),(243,'Internal medicine'),(245,'Dermatology'),(247,'Emergency medicine'),(248,'Internal medicine'),(250,'Dermatology'),(263,'Internal medicine'),(274,'Dermatology'),(277,'Emergency medicine'),(282,'Family medicine'),(288,'Emergency medicine'),(292,'Emergency medicine'),(296,'Emergency medicine'),(299,'Family medicine'),(301,'Internal medicine'),(302,'Surgery'),(303,'Emergency medicine'),(304,'Family medicine'),(307,'Dermatology'),(310,'Family medicine'),(313,'Internal medicine'),(314,'Dermatology'),(316,'Dermatology'),(318,'Emergency medicine'),(323,'Family medicine'),(324,'Dermatology'),(343,'Emergency medicine'),(351,'Dermatology'),(353,'Internal medicine'),(356,'Emergency medicine'),(360,'Dermatology'),(363,'Surgery'),(367,'Surgery'),(368,'Family medicine'),(379,'Surgery'),(380,'Family medicine'),(392,'Family medicine'),(393,'Family medicine'),(394,'Family medicine'),(395,'Surgery'),(399,'Internal medicine'),(402,'Emergency medicine'),(407,'Internal medicine'),(408,'Internal medicine'),(409,'Internal medicine'),(414,'Dermatology'),(415,'Internal medicine'),(416,'Emergency medicine'),(417,'Family medicine'),(418,'Emergency medicine'),(419,'Family medicine'),(422,'Emergency medicine'),(423,'Surgery'),(425,'Family medicine'),(428,'Internal medicine'),(432,'Emergency medicine'),(435,'Dermatology'),(436,'Internal medicine'),(449,'Dermatology'),(452,'Dermatology'),(453,'Surgery'),(457,'Internal medicine'),(458,'Surgery'),(461,'Emergency medicine'),(462,'Emergency medicine'),(465,'Surgery'),(467,'Dermatology'),(469,'Emergency medicine'),(471,'Emergency medicine'),(476,'Internal medicine'),(479,'Surgery'),(484,'Surgery'),(485,'Dermatology'),(493,'Emergency medicine'),(496,'Family medicine');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-29 20:04:44
