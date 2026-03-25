import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MentorProfileModule } from './modules/mentor-profile/mentor-profile.module';
import { CourseCategoryModule } from './modules/course-category/course-category.module';
import { CourseModule } from './modules/course/course.module';
import { AssignedCourseModule } from './modules/assigned-course/assigned-course.module';
import { PurchasedCourseModule } from './modules/purchased-course/purchased-course.module';
import { RatingModule } from './modules/rating/rating.module';
import { LastActivityModule } from './modules/last-activity/last-activity.module';
import { SectionLessonModule } from './modules/section-lesson/section-lesson.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { LessonViewModule } from './modules/lesson-view/lesson-view.module';
import { LessonFileModule } from './modules/lesson-file/lesson-file.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { HomeworkSubmissionModule } from './modules/homework-submission/homework-submission.module';
import { ExamModule } from './modules/exam/exam.module';
import { StudentExamQuestionModule } from './modules/student-exam-question/student-exam-question.module';
import { ExamResultModule } from './modules/exam-result/exam-result.module';
import { QuestionModule } from './modules/question/question.module';
import { QuestionAnswerModule } from './modules/question-answer/question-answer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), 'src', 'uploads', 'images'),
        serveRoot: '/images',
        serveStaticOptions: { index: false }
      },
      {
        rootPath: join(process.cwd(), 'src', 'uploads', 'banners'),
        serveRoot: '/banners',
        serveStaticOptions: { index: false }
      },
      {
        rootPath: join(process.cwd(), 'src', 'uploads', 'videos'),
        serveRoot: '/videos',
        serveStaticOptions: { index: false }
      },
      {
        rootPath: join(process.cwd(), 'src', 'uploads', 'homeworks'),
        serveRoot: '/homeworks',
        serveStaticOptions: { index: false }
      },
      {
        rootPath: join(process.cwd(), "src", "uploads", "lesson-file"),
        serveRoot: '/lesson-file',
        serveStaticOptions: { index: false }
      },
    )
    ,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MentorProfileModule,
    CourseCategoryModule,
    CourseModule,
    AssignedCourseModule,
    PurchasedCourseModule,
    RatingModule,
    LastActivityModule,
    SectionLessonModule,
    LessonModule,
    LessonViewModule,
    LessonFileModule,
    HomeworkModule,
    HomeworkSubmissionModule,
    ExamModule,
    StudentExamQuestionModule,
    ExamResultModule,
    QuestionModule,
    QuestionAnswerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
