SELECT * FROM monitoreodc.cm4000_8
WHERE id=5
order by fecha asc;

USE monitoreodc;
delete from monitoreodc.cm4000_8;

call loopx();

Drop procedure loopx;

DELIMITER $$  
CREATE PROCEDURE loopx()
   BEGIN
      DECLARE a INT Default 0 ;
      DECLARE dd varchar(2);
      DECLARE mm varchar(2);
      DECLARE aaaa varchar(4);
      DECLARE t varchar(8);
      DECLARE varx DECIMAL(18,2) DEFAULT 0 ;
      DECLARE max DECIMAL(18,2) DEFAULT 0.99;
      DECLARE min DECIMAL(18,2) DEFAULT 0.75;
      DECLARE fecha TIMESTAMP;
      -- Elimina ultimas mediciones
      delete from monitoreodc.cm4000_8  ORDER BY fecha asc LIMIT 27;
      --
      simple_loop: LOOP
         SET a=a+1;
         -- 
         SET aaaa = '2018';
         SET mm = '08';
         SET dd = '27';
         --
         --
         -- select a;
         IF a=10 THEN
            LEAVE simple_loop;
         END IF;
         --
         --          
         SET t = (SELECT CURRENT_TIME());
         SET fecha= concat (aaaa , '-' , mm ,'-', dd , ' ', t);         
         SET varx= RAND() * (max- min ) + min;
         insert into monitoreodc.cm4000_8(id, medicion) values(7, varx);
         --
         SET varx= RAND() * (max- min ) + min;
         insert into monitoreodc.cm4000_8(id, medicion) values(6, varx);
         SET varx= RAND() * (max- min ) + min;
         insert into monitoreodc.cm4000_8(id, medicion) values(5, varx);
         --
         -- SELECT SLEEP(1);
   END LOOP simple_loop;
END $$