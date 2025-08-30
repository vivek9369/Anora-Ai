"use client";

import React from "react";
import { LogoContainer } from "@/components/logo-container";
import Link from "next/link";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { Container } from "@/components/container";

export const Footer = () => {
  return (
    <footer className="py-5 border-t border-white/15">
      <Container className="p-4 md:px-12 md:py-2">
        <div className="flex flex-col lg:flex-row items-center gap-8 ">
          {/* Logo */}
          <div className="flex float-start lg:flex-1">
            <LogoContainer />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col lg:flex-row items-center gap-5 lg:flex-1 lg:justify-center">
            <Link
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              Developers
            </Link>
            <Link
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              Company
            </Link>
            <Link
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              Blog
            </Link>
            <Link
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              Changelog
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex gap-5 items-center lg:flex-1 lg:justify-end">
            <Link
              href="https://instagram.com/vivek_maurya69"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="text-white/40 hover:text-white transition" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/vivek-maurya-"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="text-white/40 hover:text-white transition" />
            </Link>
            <Link
              href="https://youtube.com/@yourchannel"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="text-white/40 hover:text-white transition" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
