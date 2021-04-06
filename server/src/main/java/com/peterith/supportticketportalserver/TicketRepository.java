package com.peterith.supportticketportalserver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Modifying
    @Query("UPDATE Ticket SET status=?2, updatedAt=CURRENT_TIMESTAMP WHERE id=?1")
    void updateStatusById(Long id, Status status);

    @Modifying
    @Query("UPDATE Ticket SET category=?2, updatedAt=CURRENT_TIMESTAMP WHERE id=?1")
    void updateCategoryById(Long id, Category category);

    @Modifying
    @Query("UPDATE Ticket SET category=?2, updatedAt=CURRENT_TIMESTAMP WHERE id=?1")
    void updatePriorityById(Long id, Priority priority);

    @Modifying
    @Query("UPDATE Ticket SET category=?2, updatedAt=CURRENT_TIMESTAMP WHERE id=?1")
    void updateAgentById(Long id, String agent);
}
