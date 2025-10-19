// Course Progress Tracking for Password Security Course
let courseProgress = {
  totalChapters: 10,
  completedChapters: [],
  currentChapter: 1,
  courseId: 'password-security' // Unique ID for this course
};

// Quiz Answers for Password Security Course
const quizAnswers = {
  'quiz-chapter-2': {
    q2_1: 'b', // To protect your accounts from unauthorized access
    q2_2: 'a', // Brute force attack
    q2_3: 'c'  // Over 80%
  },
  'quiz-chapter-5': {
    q5_1: 'b', // Tr0p1c@l-P!n3@ppl3-0n-7h3-B3@ch
    q5_2: 'b', // Simple substitutions are well-known to hackers
    q5_3: 'c'  // 12 characters or more
  },
  'quiz-chapter-8': {
    q8_1: 'b', // Create unique passwords for each account
    q8_2: 'a', // Use a password manager
    q8_3: 'c'  // All of the above
  },
  'quiz-chapter-10': {
    q10_1: 'c', // All of the above
    q10_2: 'b', // Change it immediately
    q10_3: 'a', // Biometric authentication plus passwords
    q10_4: 'b', // False - you need different passwords
    q10_5: 'c'  // 12+ characters with mix of types
  }
};

// Initialize Course
document.addEventListener('DOMContentLoaded', function() {
  loadProgress();
  setupEventListeners();
  updateProgressBar();
});

// Load Progress from localStorage (course-specific)
function loadProgress() {
  const saved = localStorage.getItem(`courseProgress_${courseProgress.courseId}`);
  if (saved) {
    const savedData = JSON.parse(saved);
    courseProgress.completedChapters = savedData.completedChapters || [];
    courseProgress.currentChapter = savedData.currentChapter || 1;
    updateChapterStates();
  }
}

// Save Progress to localStorage
function saveProgress() {
  localStorage.setItem(`courseProgress_${courseProgress.courseId}`, JSON.stringify({
    completedChapters: courseProgress.completedChapters,
    currentChapter: courseProgress.currentChapter
  }));
}

// Setup Event Listeners
function setupEventListeners() {
  // Chapter Navigation Clicks
  const chapterItems = document.querySelectorAll('.chapter-item');
  chapterItems.forEach(item => {
    item.addEventListener('click', function() {
      const chapterNum = parseInt(this.dataset.chapter);
      if (!this.classList.contains('locked')) {
        navigateToChapter(chapterNum);
      }
    });
  });

  // Next Chapter Buttons
  const nextButtons = document.querySelectorAll('.next-chapter');
  nextButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const nextChapter = parseInt(this.dataset.next);
      completeCurrentChapter();
      navigateToChapter(nextChapter);
    });
  });

  // Previous Chapter Buttons
  const prevButtons = document.querySelectorAll('.prev-chapter');
  prevButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const prevChapter = parseInt(this.dataset.prev);
      navigateToChapter(prevChapter);
    });
  });

  // Quiz Forms
  const quizForms = document.querySelectorAll('.quiz-form');
  quizForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleQuizSubmission(this);
    });
  });
}

// Navigate to Specific Chapter
function navigateToChapter(chapterNum) {
  // Hide all chapters
  const allChapters = document.querySelectorAll('.chapter-content');
  allChapters.forEach(chapter => {
    chapter.style.display = 'none';
  });

  // Show selected chapter
  const targetChapter = document.getElementById(`chapter-${chapterNum}`);
  if (targetChapter) {
    targetChapter.style.display = 'block';
    courseProgress.currentChapter = chapterNum;
    saveProgress();
  }

  // Update sidebar active state
  const chapterItems = document.querySelectorAll('.chapter-item');
  chapterItems.forEach(item => {
    item.classList.remove('active');
    if (parseInt(item.dataset.chapter) === chapterNum) {
      item.classList.add('active');
    }
  });

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Complete Current Chapter
function completeCurrentChapter() {
  const currentChapter = courseProgress.currentChapter;
  
  // Add to completed if not already there
  if (!courseProgress.completedChapters.includes(currentChapter)) {
    courseProgress.completedChapters.push(currentChapter);
  }

  // Unlock next chapter
  const nextChapter = currentChapter + 1;
  if (nextChapter <= courseProgress.totalChapters) {
    unlockChapter(nextChapter);
  }

  updateProgressBar();
  saveProgress();
}

// Unlock Chapter
function unlockChapter(chapterNum) {
  const chapterItems = document.querySelectorAll('.chapter-item');
  chapterItems.forEach(item => {
    if (parseInt(item.dataset.chapter) === chapterNum) {
      item.classList.remove('locked');
      const icon = item.querySelector('.chapter-icon');
      if (icon) {
        icon.textContent = '▶';
      }
    }
  });
}

// Update Chapter States (after loading)
function updateChapterStates() {
  const chapterItems = document.querySelectorAll('.chapter-item');
  
  chapterItems.forEach(item => {
    const chapterNum = parseInt(item.dataset.chapter);
    
    // Unlock completed chapters and the next one
    if (courseProgress.completedChapters.includes(chapterNum) || 
        chapterNum === 1 || 
        courseProgress.completedChapters.includes(chapterNum - 1)) {
      item.classList.remove('locked');
      const icon = item.querySelector('.chapter-icon');
      if (icon && chapterNum !== courseProgress.currentChapter) {
        if (courseProgress.completedChapters.includes(chapterNum)) {
          icon.textContent = '✓';
        } else {
          icon.textContent = '▶';
        }
      }
    }
  });

  // Navigate to current chapter
  navigateToChapter(courseProgress.currentChapter);
}

// Update Progress Bar
function updateProgressBar() {
  const completed = courseProgress.completedChapters.length;
  const total = courseProgress.totalChapters;
  const percentage = Math.round((completed / total) * 100);

  const progressBar = document.getElementById('courseProgress');
  const progressText = document.getElementById('progressText');

  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
  }

  if (progressText) {
    progressText.textContent = `${completed}/${total}`;
  }
}

// Handle Quiz Submission
function handleQuizSubmission(form) {
  const formId = form.id;
  const correctAnswers = quizAnswers[formId];
  
  if (!correctAnswers) {
    console.error('No answers found for this quiz');
    return;
  }

  let score = 0;
  let totalQuestions = Object.keys(correctAnswers).length;
  const formData = new FormData(form);
  const userAnswers = {};

  // Collect user answers
  for (let [key, value] of formData.entries()) {
    userAnswers[key] = value;
  }

  // Check if all questions are answered
  if (Object.keys(userAnswers).length < totalQuestions) {
    showFeedback(formId, 'error', '⚠️ Please answer all questions before submitting.');
    return;
  }

  // Calculate score
  for (let question in correctAnswers) {
    if (userAnswers[question] === correctAnswers[question]) {
      score++;
    }
  }

  // Show feedback
  const percentage = Math.round((score / totalQuestions) * 100);
  
  if (percentage === 100) {
    showFeedback(formId, 'success', `🎉 Perfect! You got all ${totalQuestions} questions correct! Your password security knowledge is excellent.`);
    completeCurrentChapter();
    
    // Show continue button after passing
    setTimeout(() => {
      const nextChapter = courseProgress.currentChapter + 1;
      if (nextChapter <= courseProgress.totalChapters) {
        const continueBtn = document.createElement('button');
        continueBtn.type = 'button';
        continueBtn.className = 'btn-custom mt-3';
        continueBtn.innerHTML = '<span>Continue to Next Chapter →</span>';
        continueBtn.onclick = () => navigateToChapter(nextChapter);
        
        const feedbackDiv = document.getElementById(`feedback-${formId}`);
        if (feedbackDiv) {
          feedbackDiv.appendChild(continueBtn);
        }
      } else {
        // Course completed
        showCompletionMessage(formId);
      }
    }, 500);
  } else if (percentage >= 70) {
    showFeedback(formId, 'partial', `✅ Good job! You scored ${score}/${totalQuestions} (${percentage}%). You can continue, but consider reviewing the material to strengthen your understanding.`);
    completeCurrentChapter();
    
    setTimeout(() => {
      const nextChapter = courseProgress.currentChapter + 1;
      if (nextChapter <= courseProgress.totalChapters) {
        const continueBtn = document.createElement('button');
        continueBtn.type = 'button';
        continueBtn.className = 'btn-custom mt-3';
        continueBtn.innerHTML = '<span>Continue to Next Chapter →</span>';
        continueBtn.onclick = () => navigateToChapter(nextChapter);
        
        const feedbackDiv = document.getElementById(`feedback-${formId}`);
        if (feedbackDiv) {
          feedbackDiv.appendChild(continueBtn);
        }
      } else {
        // Course completed
        showCompletionMessage(formId);
      }
    }, 500);
  } else {
    showFeedback(formId, 'error', `❌ You scored ${score}/${totalQuestions} (${percentage}%). Please review the previous chapter and try again. You need at least 70% to continue.`);
    
    // Add retry button
    setTimeout(() => {
      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'btn-custom mt-3';
      retryBtn.innerHTML = '<span>← Review Previous Chapter</span>';
      retryBtn.onclick = () => {
        const prevChapter = courseProgress.currentChapter - 1;
        navigateToChapter(prevChapter);
      };
      
      const feedbackDiv = document.getElementById(`feedback-${formId}`);
      if (feedbackDiv) {
        feedbackDiv.appendChild(retryBtn);
      }
    }, 500);
  }

  // Disable form after submission
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => input.disabled = true);
  
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
  }
}

// Show Feedback Message
function showFeedback(formId, type, message) {
  const feedbackDiv = document.getElementById(`feedback-${formId}`);
  
  if (feedbackDiv) {
    feedbackDiv.style.display = 'block';
    feedbackDiv.className = 'quiz-feedback';
    
    if (type === 'success') {
      feedbackDiv.classList.add('alert', 'alert-success');
    } else if (type === 'error') {
      feedbackDiv.classList.add('alert', 'alert-danger');
    } else if (type === 'partial') {
      feedbackDiv.classList.add('alert', 'alert-warning');
    }
    
    feedbackDiv.innerHTML = message;
  }
}

// Show Completion Message
function showCompletionMessage(formId) {
  const feedbackDiv = document.getElementById(`feedback-${formId}`);
  
  if (feedbackDiv) {
    const completionMsg = document.createElement('div');
    completionMsg.className = 'alert alert-info mt-3';
    completionMsg.innerHTML = `
      <h4>🎓 Congratulations on Completing Password Security!</h4>
      <p>You've successfully mastered password security. You now know how to:</p>
      <ul>
        <li>Create strong, unbreakable passwords</li>
        <li>Avoid common password mistakes</li>
        <li>Use password managers effectively</li>
        <li>Protect your accounts from unauthorized access</li>
        <li>Apply best practices for password management</li>
      </ul>
      <p class="mb-0"><strong>💡 Remember:</strong> Use unique passwords for every account, enable two-factor authentication, and consider using a password manager!</p>
      <a href="courses.html" class="btn-custom mt-3"><span>← Back to Course Hub</span></a>
    `;
    feedbackDiv.appendChild(completionMsg);
  }
}

// Reset Course Progress (for testing)
function resetCourse() {
  if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
    localStorage.removeItem(`courseProgress_${courseProgress.courseId}`);
    location.reload();
  }
}

// Export progress data
function exportProgress() {
  const progressData = {
    courseId: courseProgress.courseId,
    courseName: 'Password Security',
    completedChapters: courseProgress.completedChapters,
    totalChapters: courseProgress.totalChapters,
    completionPercentage: Math.round((courseProgress.completedChapters.length / courseProgress.totalChapters) * 100),
    lastAccessed: new Date().toISOString()
  };
  
  console.log('Course Progress:', progressData);
  return progressData;
}

// Password Strength Checker (bonus utility)
function checkPasswordStrength(password) {
  let strength = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 12) {
    strength += 25;
  } else if (password.length >= 8) {
    strength += 15;
    feedback.push('Password should be at least 12 characters');
  } else {
    feedback.push('Password is too short (minimum 12 characters recommended)');
  }
  
  // Complexity checks
  if (/[a-z]/.test(password)) strength += 15;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) strength += 15;
  else feedback.push('Add uppercase letters');
  
  if (/[0-9]/.test(password)) strength += 15;
  else feedback.push('Add numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
  else feedback.push('Add special characters');
  
  // Common password check
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'letmein'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    strength -= 50;
    feedback.push('Avoid common password patterns');
  }
  
  // Uniqueness bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars > password.length * 0.7) strength += 15;
  
  strength = Math.max(0, Math.min(100, strength));
  
  return {
    score: strength,
    level: strength >= 80 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak',
    feedback: feedback
  };
}

// Add console helpers for testing
console.log('Password Security Course loaded successfully!');
console.log('Available commands:');
console.log('- resetCourse() - Reset all progress');
console.log('- exportProgress() - View current progress data');
console.log('- checkPasswordStrength("yourpassword") - Test password strength');