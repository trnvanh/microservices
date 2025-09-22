package com.example.service1;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.FileWriter;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.nio.file.FileStore;
import java.nio.file.FileSystems;
import java.time.Instant;

@RestController
public class Controller {

    private static final String VSTORAGE_PATH = "/mnt/vstorage/log.txt";
    private final RestTemplate restTemplate = new RestTemplate();

    // Helper functions
    private String getUptimeHours() {
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        return String.format("%.2f", uptimeMs / 1000.0 / 3600.0);
    }

    private String getFreeDiskMB() {
        try {
            FileStore store = FileSystems.getDefault().getFileStores().iterator().next();
            long freeBytes = store.getUsableSpace();
            return String.format("%.2f", freeBytes / (1024.0 * 1024.0));
        } catch (IOException e) {
            return "unknown";
        }
    }

    // Store the log to vStorage, forward the requests to Service2 and Storage
    @GetMapping("/status")
    public String status() throws IOException {
        String record1 = "Timestamp1: uptime " + getUptimeHours() +
                " hours, free disk in root: " + getFreeDiskMB() + " Mbytes at " + Instant.now().toString();

        // Append to vStorage
        try (FileWriter fw = new FileWriter(VSTORAGE_PATH, true)) {
            fw.write(record1 + "\n");
        }

        // Send to Storage
        restTemplate.postForObject("http://storage:4000/log", record1, String.class);

        // Call Service2
        String record2 = restTemplate.getForObject("http://service2:3000/status", String.class);

        return record1 + "\n" + record2;
    }

    // Get the logs from service Storage
    @GetMapping("/log")
    public String getLogs() {
        return restTemplate.getForObject("http://storage:4000/log", String.class);
    }
}
