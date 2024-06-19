package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Entity._User;

@Repository
public interface UserRepository extends JpaRepository<_User, Long>{
	Optional<_User> findByEmail(String email);
    @Transactional
    @Modifying
    @Query("UPDATE _User a " +
            "SET a.statusUser = 1 WHERE a.email = ?1")
	int enableUser(String email);
    
    @Query("SELECT u FROM _User u WHERE u.email = ?1")
    _User findByGmail(String email);
    
    @Modifying
    @Transactional
    @Query("UPDATE _User a Set a.password = ?1 where a.email = ?2")
    void updatePassword(String password, String email);
	_User findById(int userid);
    
	_User findFirstnameById(Long userid );
//    List<User> searchByName(String firstname);
}
