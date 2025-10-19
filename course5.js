// ============================================
// LOCK-IN DIGITAL CITIZENSHIP & ONLINE ETIQUETTE COURSE SYSTEM
// ============================================
// External JavaScript File for Digital Citizenship Course
// Include this file in your HTML: <script src="js/digital-citizenship-course.js"></script>

// ============================================
// COURSE PROGRESS TRACKING
// ============================================

let courseProgress = {
  totalChapters: 7,
  completedChapters: [],
  currentChapter: 1,
  quizAttempts: {},
  startTime: null,
  endTime: null,
  courseName: 'digital-citizenship'
};

// ============================================
// QUIZ ANSWERS DATABASE
// ============================================

const quizAnswers = {
  'quiz-chapter-2': {
    q2_1: 'b',
    q2_2: 'b',
    q2_3: 'b'
  },
  'quiz-chapter-4': {
    q4_1: 'b',
    q4_2: 'b',
    q4_3: 'b'
  },
  'quiz-chapter-6': {
    q6_1: 'b',
    q6_2: 'b',
    q6_3: 'c',
    q6_4: 'b'
  },
  'quiz-chapter-7': {
    q7_1: 'b',
    q7_2: 'b',
    q7_3: 'b',
    q7_4: 'b',
    q7_5: 'b',
    q7_6: 'b'
  }
};

// ============================================
// GRADING THRESHOLDS
// ============================================

const GRADING_THRESHOLDS = {
  pass: 80,
  warning: 60,
  fail: 0
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🌐 LOCK-IN Digital Citizenship Course System Initializing...');
  loadProgressFromStorage();
  setupEventListeners();
  updateProgressBar();
  updateChapterStates();
  recordStartTime();
});

// Record Course Start Time
function recordStartTime() {
  if (!courseProgress.startTime) {
    courseProgress.startTime = new Date().toISOString();
    saveProgressToStorage();
  }
}

// ============================================
// LOCALSTORAGE MANAGEMENT
// ============================================

// Load Progress from localStorage
function loadProgressFromStorage() {
  try {
    const saved = localStorage.getItem('lockInDigitalCitizenshipProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      courseProgress = { ...courseProgress, ...parsed };
      console.log('✓ Digital citizenship course progress loaded from storage', courseProgress);
    }
  } catch (error) {
    console.warn('⚠️ Could not load digital citizenship course progress from storage:', error);
  }
}

// Save Progress to localStorage
function saveProgressToStorage() {
  try {
    localStorage.setItem('lockInDigitalCitizenshipProgress', JSON.stringify(courseProgress));
    console.log('✓ Digital citizenship course progress saved to storage');
  } catch (error) {
    console.warn('⚠️ Could not save digital citizenship course progress to storage:', error);
  }
}

// Reset Course Progress
function resetDigitalCitizenshipProgress() {
  if (confirm('⚠️ Are you sure you want to reset your digital citizenship course progress? This action cannot be undone.')) {
    try {
      localStorage.removeItem('lockInDigitalCitizenshipProgress');
      courseProgress = {
        totalChapters: 7,
        completedChapters: [],
        currentChapter: 1,
        quizAttempts: {},
        startTime: null,
        endTime: null,
        courseName: 'digital-citizenship'
      };
      location.reload();
    } catch (error) {
      console.error('Error resetting digital citizenship course progress:', error);
    }
  }
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================

function setupEventListeners() {
  // Chapter Navigation in Sidebar
  const chapterItems = document.querySelectorAll('.chapter-item');
  chapterItems.forEach(item => {
    item.addEventListener('click', function() {
      const chapterNum = parseInt(this.getAttribute('data-chapter'));
      
      if (this.classList.contains('locked')) {
        showNotification('🔒 This chapter is locked. Complete previous chapters to unlock it!', 'warning');
        return;
      }
      
      navigateToChapter(chapterNum);
    });
  });

  // Next Chapter Buttons
  const nextButtons = document.querySelectorAll('.next-chapter');
  nextButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const nextChapter = parseInt(this.getAttribute('data-next'));
      navigateToChapter(nextChapter);
    });
  });

  // Previous Chapter Buttons
  const prevButtons = document.querySelectorAll('.prev-chapter');
  prevButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const prevChapter = parseInt(this.getAttribute('data-prev'));
      navigateToChapter(prevChapter);
    });
  });

  // Quiz Form Submissions
  const quizForms = document.querySelectorAll('.quiz-form');
  quizForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleQuizSubmission(this);
    });
  });

  console.log('✓ Event listeners initialized for digital citizenship course');
}

// ============================================
// CHAPTER NAVIGATION
// ============================================

function navigateToChapter(chapterNum) {
  // Validate chapter number
  if (chapterNum < 1 || chapterNum > courseProgress.totalChapters) {
    console.warn('⚠️ Invalid chapter number:', chapterNum);
    return;
  }

  // Hide all chapters
  const allChapters = document.querySelectorAll('.chapter-content');
  allChapters.forEach(chapter => {
    chapter.style.display = 'none';
  });

  // Show selected chapter
  const targetChapter = document.getElementById('chapter-' + chapterNum);
  if (targetChapter) {
    targetChapter.style.display = 'block';
    courseProgress.currentChapter = chapterNum;
    saveProgressToStorage();
    console.log('📖 Digital citizenship course - Navigated to Chapter ' + chapterNum);
  } else {
    console.warn('⚠️ Chapter element not found:', 'chapter-' + chapterNum);
  }

  // Update sidebar active state
  const chapterItems = document.querySelectorAll('.chapter-item');
  chapterItems.forEach(item => {
    item.classList.remove('active');
    if (parseInt(item.getAttribute('data-chapter')) === chapterNum) {
      item.classList.add('active');
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// CHAPTER COMPLETION & UNLOCKING
// ============================================

function completeChapter(chapterNum) {
  // Add to completed if not already there
  if (!courseProgress.completedChapters.includes(chapterNum)) {
    courseProgress.completedChapters.push(chapterNum);
    console.log('✓ Digital citizenship course - Chapter ' + chapterNum + ' completed');
  }

  // Unlock next chapter
  const nextChapter = chapterNum + 1;
  if (nextChapter <= courseProgress.totalChapters) {
    unlockChapter(nextChapter);
  }

  // Check if course is complete
  if (courseProgress.completedChapters.length === courseProgress.totalChapters) {
    completeCourse();
  }

  updateProgressBar();
  saveProgressToStorage();
}

function unlockChapter(chapterNum) {
  const chapterItem = document.querySelector('.chapter-item[data-chapter="' + chapterNum + '"]');
  
  if (chapterItem) {
    chapterItem.classList.remove('locked');
    const icon = chapterItem.querySelector('.chapter-icon');
    if (icon) {
      icon.textContent = '▶';
    }
    console.log('🔓 Digital citizenship course - Chapter ' + chapterNum + ' unlocked');
  }
}

function updateChapterStates() {
  const chapterItems = document.querySelectorAll('.chapter-item');
  
  chapterItems.forEach(item => {
    const chapterNum = parseInt(item.getAttribute('data-chapter'));
    
    // Unlock completed chapters and next available chapter
    if (courseProgress.completedChapters.includes(chapterNum) || 
        chapterNum === 1 || 
        courseProgress.completedChapters.includes(chapterNum - 1)) {
      item.classList.remove('locked');
      
      const icon = item.querySelector('.chapter-icon');
      if (icon) {
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

// ============================================
// PROGRESS BAR MANAGEMENT
// ============================================

function updateProgressBar() {
  const completed = courseProgress.completedChapters.length;
  const total = courseProgress.totalChapters;
  const percentage = Math.round((completed / total) * 100);

  const progressBar = document.getElementById('courseProgress');
  const progressText = document.getElementById('progressText');

  if (progressBar) {
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage + '%';
    progressBar.setAttribute('aria-valuenow', percentage);
  }

  if (progressText) {
    progressText.textContent = completed + '/' + total;
  }

  console.log('📊 Digital citizenship course progress updated: ' + percentage + '%');
}

// ============================================
// QUIZ HANDLING
// ============================================

function handleQuizSubmission(form) {
  const formId = form.id;
  const correctAnswers = quizAnswers[formId];
  
  if (!correctAnswers) {
    console.error('❌ No answers found for quiz:', formId);
    return;
  }

  let score = 0;
  let totalQuestions = Object.keys(correctAnswers).length;
  const userAnswers = {};

  // Collect user answers
  const formData = new FormData(form);
  for (let [key, value] of formData.entries()) {
    userAnswers[key] = value;
  }

  // Check if all questions answered
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

  // Calculate percentage
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Extract chapter number from form ID
  const chapterMatch = formId.match(/chapter-(\d+)/);
  const chapterNum = chapterMatch ? parseInt(chapterMatch[1]) : null;

  // Track quiz attempt
  if (chapterNum) {
    courseProgress.quizAttempts[chapterNum] = {
      score: score,
      total: totalQuestions,
      percentage: percentage,
      timestamp: new Date().toISOString()
    };
  }

  // Determine result and provide feedback
  if (percentage >= GRADING_THRESHOLDS.pass) {
    showFeedback(formId, 'success', 
      `🎉 Excellent! You scored ${score}/${totalQuestions} (${percentage}%). You've mastered this material!`);
    
    if (chapterNum) {
      completeChapter(chapterNum);
      showContinueButton(formId, chapterNum + 1);
    }
  } 
  else if (percentage >= GRADING_THRESHOLDS.warning) {
    showFeedback(formId, 'warning', 
      `👍 Good effort! You scored ${score}/${totalQuestions} (${percentage}%). Review the material and try again.`);
  } 
  else {
    showFeedback(formId, 'error', 
      `📚 You scored ${score}/${totalQuestions} (${percentage}%). Please review the chapter material and try again.`);
  }

  // Disable form inputs after submission
  const inputs = form.querySelectorAll('input, button[type="submit"]');
  inputs.forEach(input => input.disabled = true);

  saveProgressToStorage();
}

// ============================================
// FEEDBACK DISPLAY
// ============================================

function showFeedback(formId, type, message) {
  const feedbackDiv = document.getElementById('feedback-' + formId);
  
  if (!feedbackDiv) {
    console.warn('⚠️ Feedback element not found:', 'feedback-' + formId);
    return;
  }

  feedbackDiv.style.display = 'block';
  feedbackDiv.innerHTML = '';

  // Create alert element
  const alert = document.createElement('div');
  alert.className = 'alert';
  
  if (type === 'success') {
    alert.className += ' alert-success';
  } else if (type === 'error') {
    alert.className += ' alert-danger';
  } else if (type === 'warning') {
    alert.className += ' alert-warning';
  }

  alert.innerHTML = message;
  feedbackDiv.appendChild(alert);
}

// Show Continue Button
function showContinueButton(formId, nextChapter) {
  if (nextChapter > courseProgress.totalChapters) {
    return; // No next chapter
  }

  const feedbackDiv = document.getElementById('feedback-' + formId);
  if (!feedbackDiv) return;

  setTimeout(() => {
    const continueBtn = document.createElement('button');
    continueBtn.type = 'button';
    continueBtn.className = 'btn-custom mt-3';
    continueBtn.innerHTML = '<span>Continue to Next Chapter →</span>';
    continueBtn.addEventListener('click', function() {
      navigateToChapter(nextChapter);
    });

    feedbackDiv.appendChild(continueBtn);
  }, 500);
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'warning' ? '#ff9800' : '#2196F3'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 9999;
    max-width: 300px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ============================================
// COURSE COMPLETION
// ============================================

function completeCourse() {
  courseProgress.endTime = new Date().toISOString();
  saveProgressToStorage();

  console.log('✅ Digital citizenship course completed!');
  console.log('📊 Final Stats:', {
    completedChapters: courseProgress.completedChapters.length,
    totalChapters: courseProgress.totalChapters,
    quizAttempts: courseProgress.quizAttempts,
    startTime: courseProgress.startTime,
    endTime: courseProgress.endTime
  });

  // Show completion alert
  setTimeout(() => {
    alert('🎉 Congratulations! You have successfully completed the Digital Citizenship & Online Etiquette course!\n\n' +
          'You now understand how to be a responsible and respectful digital citizen.\n\n' +
          'Key Takeaways:\n' +
          '• Digital citizenship involves nine essential elements\n' +
          '• Practice netiquette and respectful online communication\n' +
          '• Know your digital rights and responsibilities\n' +
          '• Be mindful of your digital footprint\n' +
          '• Think before you post and respect others online\n\n' +
          'Be a positive force in the digital world!');
  }, 500);
}

// ============================================
// STATISTICS & REPORTING
// ============================================

function getDigitalCitizenshipStats() {
  const stats = {
    progress: (courseProgress.completedChapters.length / courseProgress.totalChapters) * 100,
    completedChapters: courseProgress.completedChapters,
    totalChapters: courseProgress.totalChapters,
    quizPerformance: courseProgress.quizAttempts,
    courseDuration: courseProgress.endTime && courseProgress.startTime ? 
      calculateDuration(courseProgress.startTime, courseProgress.endTime) : 'In Progress',
    courseName: 'Digital Citizenship & Online Etiquette'
  };
  return stats;
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = Math.floor((end - start) / 1000); // in seconds

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function logDigitalCitizenshipStats() {
  const stats = getDigitalCitizenshipStats();
  console.table(stats);
}

// ============================================
// DEBUGGING & CONSOLE COMMANDS
// ============================================

console.log('%c🌐 LOCK-IN Digital Citizenship Course System Loaded', 'font-size: 16px; font-weight: bold; color: #8b5cf6;');
console.log('%cAvailable Commands:', 'font-weight: bold;');
console.log('getDigitalCitizenshipStats() - View course progress statistics');
console.log('logDigitalCitizenshipStats() - Display stats in table format');
console.log('resetDigitalCitizenshipProgress() - Reset all course progress');
console.log('courseProgress - View current progress object');