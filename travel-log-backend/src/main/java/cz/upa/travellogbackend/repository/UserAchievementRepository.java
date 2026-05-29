package cz.upa.travellogbackend.repository;

import cz.upa.travellogbackend.model.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
repozitář pro evidenci získaných úspěchů uživatelů
spravuje vazební tabulku mezi uživateli a jejich trofejemi
využívá standardní metody pro ukládání a mazání záznamů o odměnách
*/
@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
}