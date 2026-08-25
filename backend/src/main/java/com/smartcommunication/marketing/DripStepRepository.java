package com.smartcommunication.marketing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DripStepRepository extends JpaRepository<DripStep, UUID> {
    List<DripStep> findByDripSequenceIdOrderByStepOrderAsc(UUID dripSequenceId);
    void deleteByDripSequenceId(UUID dripSequenceId);
    long countByDripSequenceId(UUID dripSequenceId);
}
