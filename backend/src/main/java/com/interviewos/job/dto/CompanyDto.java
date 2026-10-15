package com.interviewos.job.dto;

import java.util.UUID;

public record CompanyDto(
    UUID id,
    String name,
    String slug,
    String logoUrl,
    String website,
    String industry,
    String headquarters,
    String overview,
    String interviewProcessNotes
) {}
