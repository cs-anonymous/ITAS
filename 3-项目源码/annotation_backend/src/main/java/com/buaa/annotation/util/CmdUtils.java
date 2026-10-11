package com.buaa.annotation.util;

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.PumpStreamHandler;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

public class CmdUtils {

    public static void runCommandLine(CommandLine commandLine) throws IOException {
        DefaultExecutor executor = new DefaultExecutor();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ByteArrayOutputStream errorStream = new ByteArrayOutputStream();
        PumpStreamHandler pumpStreamHandler = new PumpStreamHandler(outputStream, errorStream);
        executor.setStreamHandler(pumpStreamHandler);
        executor.execute(commandLine);
    }

    // 在指定目录中运行Cmd
    public static void runCommandLineInDir(CommandLine commandLine, File workingDir) throws IOException {
        if (workingDir.isDirectory()) {
            DefaultExecutor executor = new DefaultExecutor();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ByteArrayOutputStream errorStream = new ByteArrayOutputStream();
            PumpStreamHandler pumpStreamHandler = new PumpStreamHandler(outputStream, errorStream);
            executor.setStreamHandler(pumpStreamHandler);
            executor.setWorkingDirectory(workingDir);
            executor.execute(commandLine);
        }
    }
}
